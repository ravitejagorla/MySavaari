from django.urls import path
from apps.accounts.accounts_apis import auth_apis 

urlpatterns = [
    path('register/', auth_apis.admin_register, name='register'),
    path('otp_verification/', auth_apis.otp_verification, name='otp_verification'),
    path('resend_otp/', auth_apis.resend_otp, name='resend_otp'),
]