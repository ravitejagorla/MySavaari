from django.db import models
from uuid import uuid4
from apps.company.models import (
    Company,
    Branch
)

class User(models.Model):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('BRANCH_ADMIN', 'Branch Admin'),
        ('EMPLOYEE', 'Employee'),
        ('CUSTOMER', 'Customer'),
    )
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    company_instance = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='users_company')
    branch_instance = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='users_branch')
    user_id = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True, null=True)
    passcode = models.CharField(max_length=255, blank=True, null=True)
    is_lockscreen_enabled = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_company_setup_completed = models.BooleanField(default=False)
    terms_and_conditions = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone}"
    
class OTP(models.Model):
    OTP_TYPE_CHOICES = (
        ('EMAIL', 'Email'),
        ('PHONE', 'Phone'),
    )
    OTP_USED_CHOICES = (
        ('ACTIVE', 'Active'),
        ('USED', 'Used'),
        ('EXPIRED', 'Expired'),
    )
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_auth")
    otp = models.CharField(max_length=255)
    otp_type = models.CharField(max_length=10, choices=OTP_TYPE_CHOICES)
    otp_used = models.CharField(max_length=10, choices=OTP_USED_CHOICES, default='ACTIVE')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.otp_type}"

    class Meta:
        db_table = 'OTP'
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'
