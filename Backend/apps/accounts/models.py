from django.db import models
from uuid import uuid4

class User(models.Model):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('CUSTOMER', 'Customer'),
    )
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone}"

    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class UserAdmin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    admin_id = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
         return f"{self.admin_id}"

class UserCustomer(models.Model):
        id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
        user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")
        customer_id = models.CharField(max_length=20, blank=True, null=True)
        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
             return f"{self.customer_id}"
    
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
