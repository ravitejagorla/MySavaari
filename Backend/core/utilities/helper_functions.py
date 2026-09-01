import secrets
from django.utils import timezone

def generate_otp():
    return str(secrets.randbelow(900000) + 100000)

def expires_at(minutes=3):
    return timezone.now() + timezone.timedelta(minutes=minutes)