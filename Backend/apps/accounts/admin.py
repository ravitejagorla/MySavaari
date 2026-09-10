from django.contrib import admin
from apps.accounts.models import (
    User, 
    OTP
)

@admin.register(User)
class UserAdminConfig(admin.ModelAdmin):
    list_display = ("phone", "email", "role", "is_phone_verified", "is_email_verified", "is_active", "created_at")

@admin.register(OTP)
class OTPAdminConfig(admin.ModelAdmin):
    list_display = ("user", "otp_type", "otp_used", "expires_at", "created_at")