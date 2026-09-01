import csv

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.generalservices.models import (
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
            help="Path to the CSV file."
        )

        parser.add_argument(
            "--country",
            type=str,
            default="India",
            help="Country name. Default: India"
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
        # 1. GET COUNTRY
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
        # 2. CACHES
        # ---------------------------------------------------------

        state_cache = {}
        city_cache = {}

        # ---------------------------------------------------------
        # 3. COUNTERS
        # ---------------------------------------------------------

        total_rows = 0
        new_states = 0
        new_cities = 0
        new_areas = 0

        # ---------------------------------------------------------
        # 4. OPEN CSV
        # ---------------------------------------------------------

        try:

            with open(
                csv_file_path,
                mode="r",
                encoding="utf-8-sig",
                newline=""
            ) as file:

                reader = csv.DictReader(file)

                # -------------------------------------------------
                # VALIDATE HEADER
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
                        f"CSV is missing required columns: "
                        f"{', '.join(sorted(missing_columns))}"
                    )

                # -------------------------------------------------
                # PROCESS ROWS
                # -------------------------------------------------

                for row_number, row in enumerate(
                    reader,
                    start=2
                ):

                    total_rows += 1

                    try:

                        # -----------------------------------------
                        # CLEAN VALUES
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

                        # District is currently ignored because
                        # your City model does not contain district.

                        if not state_name:
                            raise ValueError(
                                "State is empty"
                            )

                        if not city_name:
                            raise ValueError(
                                "City is empty"
                            )

                        if not area_name:
                            raise ValueError(
                                "Area is empty"
                            )

                        if not pincode:
                            raise ValueError(
                                "Pincode is empty"
                            )

                        # -----------------------------------------
                        # STATE
                        # -----------------------------------------

                        state_key = state_name.lower()

                        state = state_cache.get(state_key)

                        if state is None:

                            state, created = (
                                State.objects.get_or_create(
                                    country_instance=country,
                                    state_name__iexact=state_name,
                                    defaults={
                                        "state_name": state_name,
                                        "created_at": timezone.now(),
                                        "is_active": True,
                                    }
                                )
                            )

                            state_cache[state_key] = state

                            if created:

                                new_states += 1

                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"Created State: "
                                        f"{state.state_name}"
                                    )
                                )

                        # -----------------------------------------
                        # CITY
                        # -----------------------------------------

                        city_key = (
                            state.id,
                            city_name.lower(),
                        )

                        city = city_cache.get(city_key)

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
                                    }
                                )
                            )

                            city_cache[city_key] = city

                            if created:

                                new_cities += 1

                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"Created City: "
                                        f"{city.city_name}"
                                    )
                                )

                        # -----------------------------------------
                        # AREA
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
                                }
                            )
                        )

                        if created:

                            new_areas += 1

                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"Created Area: "
                                    f"{area.area_name} "
                                    f"({area.pin_code})"
                                )
                            )

                    except Exception as row_error:

                        raise CommandError(
                            f"Error processing CSV row "
                            f"{row_number}: {row}\n"
                            f"Error: {row_error}"
                        )

        except FileNotFoundError:

            raise CommandError(
                f"CSV file not found: {csv_file_path}"
            )

        except UnicodeDecodeError:

            raise CommandError(
                "Unable to read the CSV file as UTF-8."
            )

        # ---------------------------------------------------------
        # 5. SUMMARY
        # ---------------------------------------------------------

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("=" * 50)
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Geographic Data Import Completed"
            )
        )

        self.stdout.write(
            f"Country: {country.country_name}"
        )

        self.stdout.write(
            f"Rows Processed: {total_rows}"
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

        self.stdout.write(
            self.style.SUCCESS("=" * 50)
        )