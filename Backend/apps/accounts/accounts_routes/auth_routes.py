from django.urls import path
from apps.accounts.accounts_apis import auth_apis 

urlpatterns = [
    path('register/', auth_apis.admin_register, name='register'),
    path('otp_verification/', auth_apis.otp_verification, name='otp_verification'),
    path('resend_otp/', auth_apis.resend_otp, name='resend_otp'),
    path('login/', auth_apis.admin_login, name='login'),
    path('lock_screen/', auth_apis.lock_screen, name='lock_screen'),
    path('unlock_screen/', auth_apis.unlock_screen, name='unlock_screen'),
]