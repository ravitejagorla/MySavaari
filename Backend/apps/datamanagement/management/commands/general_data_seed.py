from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from apps.generalservices.models import (
    BankNames,
    BankAccountType,
    UpiNames,
    Genders,
    AgeGroup,
    BloodGroup,
    Nationality,
    Country,
)


class Command(BaseCommand):
    help = "Seed master data (banks, account types, upi, gender, age group, blood group, nationality, countries)"

    @transaction.atomic
    def handle(self, *args, **kwargs):

        # ---------------- BANK NAMES ----------------
        bank_names = [
            "State Bank of India",
            "HDFC Bank",
            "ICICI Bank",
            "Axis Bank",
            "Kotak Mahindra Bank",
            "Punjab National Bank",
        ]

        for name in bank_names:
            BankNames.objects.get_or_create(
                bank_name=name,
                defaults={"is_active": True, "created_at": timezone.now()}
            )

        # ---------------- BANK ACCOUNT TYPES ----------------
        account_types = [
            "Savings Account",
            "Current Account",
            "Salary Account",
            "Fixed Deposit",
        ]

        for acc_type in account_types:
            BankAccountType.objects.get_or_create(
                bank_account_type=acc_type,
                defaults={"is_active": True, "created_at": timezone.now()}
            )

        # ---------------- UPI NAMES ----------------
        upi_names = [
            "Google Pay",
            "PhonePe",
            "Paytm",
            "BHIM",
            "Amazon Pay",
        ]

        for upi in upi_names:
            UpiNames.objects.get_or_create(
                upi_names=upi,
                defaults={"is_active": True, "created_at": timezone.now()}
            )

        # ---------------- GENDERS ----------------
        genders = [
            ("Male", "M"),
            ("Female", "F"),
            ("Other", "O"),
        ]

        for gender, short in genders:
            Genders.objects.get_or_create(
                gender_name=gender,
                defaults={
                    "gender_short_name": short,
                    "is_active": True,
                    "created_at": timezone.now()
                }
            )

        # ---------------- AGE GROUPS ----------------
        age_groups = [
            "0-12",
            "13-18",
            "19-25",
            "26-35",
            "36-45",
            "46-60",
            "60+",
        ]

        for group in age_groups:
            AgeGroup.objects.get_or_create(
                age_group_name=group,
                defaults={"is_active": True, "created_at": timezone.now()}
            )

        # ---------------- BLOOD GROUPS ----------------
        blood_groups = [
            "A+","A-",
            "B+","B-",
            "AB+","AB-",
            "O+","O-",
        ]

        for bg in blood_groups:
            BloodGroup.objects.get_or_create(
                blood_group_name=bg,
                defaults={"is_active": True, "created_at": timezone.now()}
            )

        # ---------------- NATIONALITY ----------------
        nationalities = {
            'Indian', 'Pakistani', 'Bangladeshi', 'Nepali', 'Sri Lankan',
            'Maldivian', 'Singaporean', 'Malaysian', 'Filipino', 'Thai',
            'Vietnamese', 'Cambodian', 'Laotian', 'Burmese',
            'Indonesian', 'Japanese', 'Korean', 'Chinese',
            'Taiwanese', 'Hong Konger', 'Macanese'
        }

        for name in nationalities:
            Nationality.objects.get_or_create(
                nationality_name=name,
                defaults={
                    "is_active": True,
                    "created_at": timezone.now()
                }
            )

        # ---------------- COUNTRIES ----------------
        countries = [
            ("India", "IN", "+91"),
            ("Pakistan", "PK", "+92"),
            ("Bangladesh", "BD", "+880"),
            ("Nepal", "NP", "+977"),
            ("Sri Lanka", "LK", "+94"),
            ("Maldives", "MV", "+960"),
            ("Singapore", "SG", "+65"),
            ("Malaysia", "MY", "+60"),
            ("Philippines", "PH", "+63"),
            ("Thailand", "TH", "+66"),
            ("Vietnam", "VN", "+84"),
            ("Cambodia", "KH", "+855"),
            ("Laos", "LA", "+856"),
            ("Myanmar", "MM", "+95"),
            ("Indonesia", "ID", "+62"),
            ("Japan", "JP", "+81"),
            ("South Korea", "KR", "+82"),
            ("China", "CN", "+86"),
            ("Taiwan", "TW", "+886"),
            ("Hong Kong", "HK", "+852"),
            ("Macau", "MO", "+853"),
        ]

        for name, iso_code, phone_code in countries:

            Country.objects.get_or_create(
                country_name=name,
                defaults={
                    "country_iso_code": iso_code,
                    "country_phone_code": phone_code,
                    "is_active": True,
                    "created_at": timezone.now(),
                }
            )

        self.stdout.write(
            self.style.SUCCESS("✅ Master data seeded successfully!")
        )