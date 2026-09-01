from django.contrib import admin
from apps.accounts.models import (
    User, 
    UserAdmin, 
    UserCustomer, 
    OTP
)

@admin.register(User)
class UserAdminConfig(admin.ModelAdmin):
    list_display = ("phone", "email", "role", "is_phone_verified", "is_email_verified", "is_active", "created_at")

@admin.register(UserAdmin)
class UserAdminProfileConfig(admin.ModelAdmin):
    list_display = ("admin_id", "user", "created_at")

@admin.register(UserCustomer)
class UserCustomerAdminConfig(admin.ModelAdmin):
    list_display = ("customer_id", "user", "created_at")

@admin.register(OTP)
class OTPAdminConfig(admin.ModelAdmin):
    list_display = ("user", "otp_type", "otp_used", "expires_at", "created_at")