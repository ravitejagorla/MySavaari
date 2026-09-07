import csv

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.datamanagement.models import (
    Country,
    State,
    City,
    Area,
)


class Command(BaseCommand):
    help = "Import State, City and Area data from a CSV file."

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_file",
            type=str,
            help="Path to the CSV file.",
        )

        parser.add_argument(
            "--country",
            type=str,
            default="India",
            help="Country name. Default: India",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        csv_file_path = options["csv_file"]
        country_name = options["country"]

        self.stdout.write(
            f"Importing geographic data from: {csv_file_path}"
        )

        self.stdout.write(
            f"Country: {country_name}"
        )

        # ---------------------------------------------------------
        # Get Country
        # ---------------------------------------------------------

        try:
            country = Country.objects.get(
                country_name__iexact=country_name
            )

        except Country.DoesNotExist:
            raise CommandError(
                f"Country '{country_name}' does not exist. "
                f"Please create it first."
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Found Country: {country.country_name}"
            )
        )

        # ---------------------------------------------------------
        # Caches
        # ---------------------------------------------------------

        state_cache = {}
        city_cache = {}

        # ---------------------------------------------------------
        # Counters
        # ---------------------------------------------------------

        total_rows = 0

        imported_rows = 0

        skipped_rows = 0

        new_states = 0
        new_cities = 0
        new_areas = 0

        skipped_details = []

        # ---------------------------------------------------------
        # Open CSV
        # ---------------------------------------------------------

        try:
            with open(
                csv_file_path,
                mode="r",
                encoding="utf-8-sig",
                newline="",
            ) as file:

                reader = csv.DictReader(file)

                # -------------------------------------------------
                # Validate CSV Header
                # -------------------------------------------------

                required_columns = {
                    "City",
                    "Area",
                    "Pincode",
                    "District",
                    "State",
                }

                if not reader.fieldnames:
                    raise CommandError(
                        "CSV file does not contain a header."
                    )

                actual_columns = {
                    column.strip()
                    for column in reader.fieldnames
                    if column
                }

                missing_columns = (
                    required_columns - actual_columns
                )

                if missing_columns:
                    raise CommandError(
                        "CSV is missing required columns: "
                        f"{', '.join(sorted(missing_columns))}"
                    )

                # -------------------------------------------------
                # Process Rows
                # -------------------------------------------------

                for row_number, row in enumerate(
                    reader,
                    start=2,
                ):
                    total_rows += 1

                    try:
                        # -----------------------------------------
                        # Detect malformed CSV rows
                        # -----------------------------------------

                        if None in row:
                            skipped_rows += 1

                            skipped_details.append(
                                {
                                    "row": row_number,
                                    "reason": (
                                        "Malformed CSV row / "
                                        "extra columns"
                                    ),
                                    "data": row,
                                }
                            )

                            continue

                        # -----------------------------------------
                        # Read values
                        # -----------------------------------------

                        state_name = (
                            row.get("State") or ""
                        ).strip()

                        city_name = (
                            row.get("City") or ""
                        ).strip()

                        area_name = (
                            row.get("Area") or ""
                        ).strip()

                        pincode = (
                            row.get("Pincode") or ""
                        ).strip()

                        # -----------------------------------------
                        # Validate required values
                        # -----------------------------------------

                        if not state_name:
                            skipped_rows += 1

                            skipped_details.append(
                                {
                                    "row": row_number,
                                    "reason": "State is empty",
                                    "data": row,
                                }
                            )

                            continue

                        if not city_name:
                            skipped_rows += 1

                            skipped_details.append(
                                {
                                    "row": row_number,
                                    "reason": "City is empty",
                                    "data": row,
                                }
                            )

                            continue

                        if not area_name:
                            skipped_rows += 1

                            skipped_details.append(
                                {
                                    "row": row_number,
                                    "reason": "Area is empty",
                                    "data": row,
                                }
                            )

                            continue

                        if not pincode:
                            skipped_rows += 1

                            skipped_details.append(
                                {
                                    "row": row_number,
                                    "reason": "Pincode is empty",
                                    "data": row,
                                }
                            )

                            continue

                        # -----------------------------------------
                        # State
                        # -----------------------------------------

                        state_key = state_name.lower()

                        state = state_cache.get(
                            state_key
                        )

                        if state is None:
                            state, created = (
                                State.objects.get_or_create(
                                    country_instance=country,
                                    state_name__iexact=state_name,
                                    defaults={
                                        "state_name": state_name,
                                        "created_at": timezone.now(),
                                        "is_active": True,
                                    },
                                )
                            )

                            state_cache[state_key] = state

                            if created:
                                new_states += 1

                                self.stdout.write(
                                    self.style.SUCCESS(
                                        "Created State: "
                                        f"{state.state_name}"
                                    )
                                )

                        # -----------------------------------------
                        # City
                        # -----------------------------------------

                        city_key = (
                            state.id,
                            city_name.lower(),
                        )

                        city = city_cache.get(
                            city_key
                        )

                        if city is None:
                            city, created = (
                                City.objects.get_or_create(
                                    country_instance=country,
                                    state_instance=state,
                                    city_name__iexact=city_name,
                                    defaults={
                                        "city_name": city_name,
                                        "created_at": timezone.now(),
                                        "is_active": True,
                                    },
                                )
                            )

                            city_cache[city_key] = city

                            if created:
                                new_cities += 1

                                self.stdout.write(
                                    self.style.SUCCESS(
                                        "Created City: "
                                        f"{city.city_name}"
                                    )
                                )

                        # -----------------------------------------
                        # Area
                        # -----------------------------------------

                        area, created = (
                            Area.objects.get_or_create(
                                country_instance=country,
                                state_instance=state,
                                city_instance=city,
                                area_name__iexact=area_name,
                                pin_code=pincode,
                                defaults={
                                    "area_name": area_name,
                                    "created_at": timezone.now(),
                                    "is_active": True,
                                },
                            )
                        )

                        if created:
                            new_areas += 1

                            self.stdout.write(
                                self.style.SUCCESS(
                                    "Created Area: "
                                    f"{area.area_name} "
                                    f"({area.pin_code})"
                                )
                            )

                        imported_rows += 1

                    # ---------------------------------------------
                    # Any unexpected row-level error
                    # ---------------------------------------------

                    except Exception as row_error:
                        skipped_rows += 1

                        skipped_details.append(
                            {
                                "row": row_number,
                                "reason": str(row_error),
                                "data": row,
                            }
                        )

                        continue

        except FileNotFoundError:
            raise CommandError(
                f"CSV file not found: {csv_file_path}"
            )

        except UnicodeDecodeError:
            raise CommandError(
                "Unable to read the CSV file as UTF-8."
            )

        # ---------------------------------------------------------
        # Import Summary
        # ---------------------------------------------------------

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS("=" * 60)
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Geographic Data Import Completed"
            )
        )

        self.stdout.write(
            self.style.SUCCESS("=" * 60)
        )

        self.stdout.write(
            f"Country: {country.country_name}"
        )

        self.stdout.write(
            f"Total CSV Rows: {total_rows}"
        )

        self.stdout.write(
            f"Imported Rows: {imported_rows}"
        )

        self.stdout.write(
            f"Skipped Rows: {skipped_rows}"
        )

        self.stdout.write(
            f"New States: {new_states}"
        )

        self.stdout.write(
            f"New Cities: {new_cities}"
        )

        self.stdout.write(
            f"New Areas: {new_areas}"
        )

        # ---------------------------------------------------------
        # Skipped Row Details
        # ---------------------------------------------------------

        if skipped_details:
            self.stdout.write("")

            self.stdout.write(
                self.style.WARNING(
                    "Skipped Row Details:"
                )
            )

            self.stdout.write(
                self.style.WARNING("-" * 60)
            )

            for skipped in skipped_details:
                self.stdout.write(
                    self.style.WARNING(
                        f"Row {skipped['row']}: "
                        f"{skipped['reason']}"
                    )
                )

                data = skipped["data"]

                city = data.get("City", "")
                area = data.get("Area", "")
                pincode = data.get("Pincode", "")
                state = data.get("State", "")

                self.stdout.write(
                    f"    City: {city}"
                )

                self.stdout.write(
                    f"    Area: {area}"
                )

                self.stdout.write(
                    f"    Pincode: {pincode}"
                )

                self.stdout.write(
                    f"    State: {state}"
                )

        else:
            self.stdout.write("")

            self.stdout.write(
                self.style.SUCCESS(
                    "No rows were skipped."
                )
            )

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS("=" * 60)
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Import finished successfully."
            )
        )

        self.stdout.write(
            self.style.SUCCESS("=" * 60)
        )