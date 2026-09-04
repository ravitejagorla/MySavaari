from django.urls import path
from apps.accounts.accounts_apis import auth_apis

urlpatterns = [
    # user info
    path('me/', auth_apis.get_current_user, name='current_user'),

    # admin registration and login
    path('register/', auth_apis.admin_register, name='register'),
    path('otp_verification/', auth_apis.otp_verification, name='otp_verification'),
    path('resend_otp/', auth_apis.resend_otp, name='resend_otp'),
    path('login/', auth_apis.admin_login, name='login'),

    # PIN / Lock Screen
    path('set_passcode/', auth_apis.set_passcode, name='set_passcode'),
    path('change_passcode/', auth_apis.change_passcode, name='change_passcode'),
    path('passcode_status/', auth_apis.passcode_status, name='passcode_status'),
    path('lockscreen_settings/', auth_apis.lockscreen_settings, name='lockscreen_settings'),
    path('lock_screen/', auth_apis.lock_screen, name='lock_screen'),
    path('unlock_screen/', auth_apis.unlock_screen, name='unlock_screen'),
]