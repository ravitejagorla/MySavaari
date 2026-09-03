from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from core.utilities.helper_functions import generate_otp, expires_at
from core.utilities.encryption import encrypt, decrypt
from core.services.sms_services import send_otp_sms
from core.services.email_services import send_otp_email
from core.services.generate_global_sequence import generate_sequence_id
from core.services.jwt_session import generate_login_jwt, generate_otp_jwt, decode_jwt, CJWTUser, CustomJWTAuthentication
from apps.accounts.models import (
    User,
    UserAdmin,
    UserCustomer,
    OTP
)
from apps.accounts.serializers import (
    UserSerializer,
    UserAdminSerializer,
    UserCustomerSerializer,
    OTPSerializer
)
@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def admin_register(request):
    try:
        data = request.data
        print("================================================================================")
        print("data", data)
        print("================================================================================")
        first_name = data.get("first_name", "").strip()
        middle_name = data.get("middle_name", "").strip()
        last_name = data.get("last_name", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirm_password", "").strip()
        terms_and_conditions = data.get("terms_and_conditions", False)
        role = "ADMIN"
        if not all([first_name, last_name, email, phone, password, confirm_password]):
            return Response({'status':'error','subject':'Fill form','message': 'All fields are required.'}, status=status.HTTP_200_OK)
        if password != confirm_password:
            return Response({'status':'error','subject':'Passwords','message': 'Passwords do not match.'}, status=status.HTTP_200_OK)
        if not terms_and_conditions:
            return Response({'status':'error','subject':'Terms and Conditions','message': 'You must accept the terms and conditions.'}, status=status.HTTP_200_OK)
        email_exists = User.objects.filter(email=email, role=role).exists()
        phone_exists = User.objects.filter(phone=phone, role=role).exists()
        # existing_user = User.objects.filter(role="ADMIN").filter(Q(email=email) | Q(phone=phone)).first()
        # if existing_user:
        #     if existing_user.is_email_verified and existing_user.is_phone_verified:
        #         return Response({
        #             "status": "error",
        #             "subject": "Already Registered",
        #             "message": "An account with this email or phone number is already registered."
        #         }, status=status.HTTP_200_OK)

        #     return Response({
        #         "status": "success",
        #         "subject": "Registration",
        #         "message": "Registration already exists. Continue verification.",
        #         "data": {
        #             "user_id": encrypt(str(existing_user.id)),
        #             "is_email_verified": existing_user.is_email_verified,
        #             "is_phone_verified": existing_user.is_phone_verified
        #         }
        #     }, status=status.HTTP_200_OK)
        if email_exists and phone_exists:
            return Response({'status':'error','subject':'Email and Phone','message': 'Email and Phone number already exists.'}, status=status.HTTP_200_OK)
        if email_exists:
            return Response({'status':'error','subject':'Email','message': 'Email already exists.'}, status=status.HTTP_200_OK)
        if phone_exists:
            return Response({'status':'error','subject':'Phone','message': 'Phone number already exists.'}, status=status.HTTP_200_OK)
        
        hashed_password = make_password(password)

        user = User.objects.create(
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            role=role,
            email=email,
            phone=phone,
            password=hashed_password,
            terms_and_conditions=terms_and_conditions
        )
        admin_id = generate_sequence_id(role)
        user_admin = UserAdmin.objects.create(
            user=user,
            admin_id=admin_id
        )
        email_otp = generate_otp()
        OTP.objects.create(
            user=user,
            otp=email_otp,
            otp_type="EMAIL",
            expires_at=expires_at(5)
        )
        send_otp_email(user.email, email_otp, f"{user.last_name if user.last_name else user.first_name}", purpose="Email OTP", expiry_minutes=5)
        
        return Response(
            {
                "status": "success",
                "subject": "Registration",
                "message": "Registration successful. OTP sent to your email and phone.",
                "data": {
                    "user_id": encrypt(str(user.id)),
                }
            }
        )
    except Exception as e:
        print("Error", str(e))
        return Response({'status':'error','subject':'Registration','message': 'Registration failed.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def otp_verification(request):
    try:
        data = request.data
        print("================================================================================")
        print("data", data)
        print("================================================================================")
        user_id = decrypt(data.get("user_id", "").strip())
        entered_otp = data.get("otp", "").strip()
        otp_type = data.get("otp_type", "").strip().upper()
        if not all([user_id, entered_otp, otp_type]):
            return Response({'status':'error','subject':'OTP','message': 'All fields are required.'}, status=status.HTTP_200_OK)
        user = User.objects.get(id=user_id)
        if otp_type == 'EMAIL':
            otp = OTP.objects.get(user=user, otp_type='EMAIL', otp_used='ACTIVE')
            if otp.expires_at < timezone.now():
                otp.otp_used = "EXPIRED"
                otp.save(update_fields=["otp_used"])
                return Response({'status':'error','subject':'OTP','message': 'OTP has expired.'}, status=status.HTTP_200_OK)
            if otp.otp != entered_otp:
                return Response({'status':'error','subject':'OTP','message': 'Invalid OTP.'}, status=status.HTTP_200_OK)
            otp.otp_used = 'USED'
            otp.save()
            user.is_email_verified = True
            user.save()
            if user.role == "ADMIN":
                phone_otp = generate_otp()
                OTP.objects.create(
                    user=user,
                    otp=phone_otp,
                    otp_type="PHONE",
                    expires_at=expires_at(5)
                )
                send_otp_sms(recipient_phone=user.phone, otp=phone_otp, purpose="Admin Registration", expiry_minutes=5,)
            return Response({'status':'success','subject':'OTP','message': 'OTP verified.', 'data' : {"user_id" : encrypt(str(user.id))}}, status=status.HTTP_200_OK)
        elif otp_type == 'PHONE':
            otp = OTP.objects.get(user=user, otp_type='PHONE', otp_used='ACTIVE')
            if otp.expires_at < timezone.now():
                otp.otp_used = "EXPIRED"
                otp.save(update_fields=["otp_used"])
                return Response({'status':'error','subject':'OTP','message': 'OTP has expired.'}, status=status.HTTP_200_OK)
            if otp.otp != entered_otp:
                return Response({'status':'error','subject':'OTP','message': 'Invalid OTP.'}, status=status.HTTP_200_OK)
            otp.otp_used = 'USED'
            otp.save()
            user.is_phone_verified = True
            user.save()
            return Response({'status':'success','subject':'OTP','message': 'OTP verified.', 'data' : {"user_id" : encrypt(str(user.id))}}, status=status.HTTP_200_OK)
        else:
            return Response({'status':'error','subject':'OTP','message': 'Invalid OTP type.'}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error", str(e))
        return Response({'status':'error','subject':'OTP','message': 'OTP verification failed.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def resend_otp(request):
    try:
        data = request.data
        print("================================================================================")
        print("data", data)
        print("================================================================================")
        user_id = decrypt(data.get("user_id", "").strip())
        otp_type = data.get("otp_type", "").strip().upper()
        if not all([user_id, otp_type]):
            return Response({'status':'error','subject':'OTP','message': 'Somthing went wrong.'}, status=status.HTTP_200_OK)
        elif otp_type not in ["EMAIL", "PHONE"]:
            return Response({"status": "error", "subject": "OTP", "message": "Invalid OTP type."}, status=status.HTTP_200_OK)
        user = User.objects.get(id=user_id)
        if otp_type == "EMAIL" and user.is_email_verified:
            return Response({"status": "error", "subject": "OTP", "message": "OTP already verified."}, status=status.HTTP_200_OK)
        elif otp_type == "PHONE" and user.is_phone_verified:
            return Response({"status": "error", "subject": "OTP", "message": "OTP already verified."}, status=status.HTTP_200_OK)
        current_otp = OTP.objects.filter(
            user=user,
            otp_used="ACTIVE",
            otp_type=otp_type
        ).order_by("-created_at").first()

        if current_otp:
            current_otp.otp_used = "EXPIRED"
            current_otp.save(update_fields=["otp_used"])
        otp = generate_otp()
        OTP.objects.create(
            user=user,
            otp=otp,
            otp_type=otp_type,
            expires_at=expires_at(5)
        )
        if otp_type == "EMAIL":
            send_otp_email(user.email, otp, f"{user.last_name if user.last_name else user.first_name}", purpose="Email OTP", expiry_minutes=5)
        elif otp_type == "PHONE":
            send_otp_sms(recipient_phone=user.phone, otp=otp, purpose="Admin Registration", expiry_minutes=5,)
        return Response({ "status": "success", "subject": "OTP", "message": "OTP resent successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error", str(e))
        return Response({'status':'error','subject':'OTP','message': 'OTP resend failed.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def admin_login(request):
    try:
        data = request.data
        print("================================================================================")
        print("data", data)
        print("================================================================================")
        username = data.get("username", "").strip().lower()
        password = data.get("password", "").strip()
        if not all([username, password]):
            return Response({'status':'error','subject':'Login','message': 'All fields are required.'}, status=status.HTTP_200_OK)
        user = User.objects.filter(Q(email=username) | Q(phone=username)).first()
        if not user:
            return Response({'status':'error','subject':'Login','message': 'Invalid username or password.'}, status=status.HTTP_200_OK)
        if not user.is_active:
            return Response({'status':'error','subject':'Login','message': 'Account is inactive.'}, status=status.HTTP_200_OK)
        if not check_password(password, user.password):
            return Response({'status':'error','subject':'Login','message': 'Invalid username or password.'}, status=status.HTTP_200_OK)
        if not user.is_email_verified or not user.is_phone_verified:
            return Response({'status':'error','subject':'Login','message': 'Email or phone verification is required.'}, status=status.HTTP_200_OK)
        token = generate_login_jwt(encrypt(str(user.id)), "ADMIN")
        return Response({ "status": "success", "subject": "Login", "message": "Login successful.", "data": {"token": token}})
    except Exception as e:
        print("Error", str(e))
        return Response({'status':'error','subject':'Login','message': 'Login failed.'}, status=status.HTTP_200_OK)
        
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def lock_screen(request):
    try:
        user_info = request.user_info
        encrypted_user_id = user_info.get('user_id')
        if not encrypted_user_id:
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'User not found.'}, status=status.HTTP_200_OK)
        user_id = decrypt(encrypted_user_id)
        user = User.objects.get(id=user_id)
        if not user.is_active:
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'Account is inactive.'}, status=status.HTTP_200_OK)
        user.is_locked = True
        user.save(update_fields=['is_locked'])
        return Response({'status': 'success', 'subject': 'Lock Screen', 'message': 'Lock screen successful.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'User not found.'}, status=status.HTTP_200_OK)
    except Exception as e:
        print('Error:', str(e))
        return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'Lock screen failed.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def unlock_screen(request):
    try:
        user_info = request.user_info
        encrypted_user_id = user_info.get('user_id')
        entered_pin = str(request.data.get('pin', '')).strip()
        if not encrypted_user_id or not entered_pin:
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'PIN is required.'}, status=status.HTTP_200_OK)
        user_id = decrypt(encrypted_user_id)
        user = User.objects.get(id=user_id)
        if not user.is_active:
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'Account is inactive.'}, status=status.HTTP_200_OK)
        if not user.passcode:
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'Passcode is not configured.'}, status=status.HTTP_200_OK)
        if not check_password(entered_pin, user.passcode):
            return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'Invalid PIN.'}, status=status.HTTP_200_OK)
        user.is_locked = False
        user.save(update_fields=['is_locked'])
        return Response({'status': 'success', 'subject': 'Lock Screen', 'message': 'Unlocked successfully.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'User not found.'}, status=status.HTTP_200_OK)
    except Exception as e:
        print('Error:', str(e))
        return Response({'status': 'error', 'subject': 'Lock Screen', 'message': 'PIN verification failed.'}, status=status.HTTP_200_OK)