from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from core.utilities.helper_functions import generate_otp, expires_at
from core.utilities.encryption import encrypt, decrypt
from core.services.sms_services import send_otp_sms
from core.services.email_services import send_otp_email
from core.services.generate_global_sequence import generate_sequence_id
from core.services.jwt_session import generate_login_jwt
from apps.accounts.models import User
from apps.company.models import Company, Branch
from apps.datamanagement.models import (
    Area,
    CompanyType,
)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def company_setup(request):
    try:
        user_info = request.user_info
        user_id = decrypt(user_info.get("user_id"))
        if not user_id:
            return Response({"status": "error", "subject": "Company Setup", "message": "User not found.",}, status=status.HTTP_200_OK,)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({ "status": "error", "subject": "Company Setup", "message": "User not found.",}, status=status.HTTP_200_OK,)
        data = request.data
        print("================================================================================")
        print("data ", data)
        print("================================================================================")
        company_registered_name = data.get("company_registered_name", "").strip()
        company_short_name = data.get("company_short_name", "").strip()
        state_of_recognitation = data.get("state_of_recognitation", "").strip()
        registration_number = data.get("registration_number", "").strip()
        license_number = data.get("license_number", "").strip()
        company_type = data.get("company_type", "").strip()
        phone_number = data.get("phone_number", "").strip()
        emergency_number = data.get("emergency_number", "").strip()
        email = data.get("email", "").strip().lower()
        is_available_24_7 = (data.get("is_available_24_7", "false").lower() == "true")
        time_from = data.get("time_from", "").strip()
        time_to = data.get("time_to", "").strip()
        area = data.get("area", "").strip()
        address = data.get("address", "").strip()
        company_description = data.get("company_description", "").strip()
        company_icon = data.get("company_icon")
        company_logo = data.get("company_logo")
        company_cover = data.get("company_cover")
        establish_date = data.get("establish_date", "").strip()
        registration_date = data.get("registration_date", "").strip()
        company_website = data.get("company_website", "").strip()
        branch_identity_name = data.get("branch_identity_name", "").strip()
        password = data.get("password", "").strip()
        required_fields = [
            company_registered_name, company_short_name, state_of_recognitation, registration_number, license_number, company_type, phone_number, emergency_number, email, area, address,
            company_description, company_icon, company_logo, establish_date, registration_date, company_website, branch_identity_name, password
        ]
        if not is_available_24_7:
            required_fields.extend([time_from, time_to,])
        if not all(required_fields):
            return Response({"status": "error", "subject": "Company Setup", "message": "All required fields must be provided.",}, status=status.HTTP_200_OK,)
        try:
            company_type_instance = CompanyType.objects.get(id=company_type,is_active=True,)
        except CompanyType.DoesNotExist:
            return Response({"status": "error", "subject": "Company Setup", "message": "Invalid company type.",}, status=status.HTTP_200_OK,)
        try:
            area_instance = (Area.objects.select_related("city_instance", "state_instance", "country_instance").get(id=area,is_active=True,))
        except Area.DoesNotExist:
            return Response({"status": "error", "subject": "Company Setup", "message": "Invalid area.",}, status=status.HTTP_200_OK,)
        company_crn = generate_sequence_id("CRN")
        company = Company.objects.create(
            company_crn=company_crn,
            company_registered_name=company_registered_name,
            company_short_name=company_short_name,
            state_of_recognitation=state_of_recognitation,
            registration_number=registration_number,
            license_number=license_number,
            company_type_instance=company_type_instance,
            registration_date=registration_date,
            phone_number=phone_number,
            emergency_number=emergency_number,
            email=email,
            is_available_24_7=is_available_24_7,
            time_from=(None if is_available_24_7 else time_from),
            time_to=(None if is_available_24_7 else time_to),
            area_instance=area_instance,
            city_instance=area_instance.city_instance,
            state_instance=area_instance.state_instance,
            country_instance=area_instance.country_instance,
            address=address,
            company_description=company_description,
            company_icon=company_icon,
            company_logo=company_logo,
            company_cover=company_cover,
            establish_date=establish_date,
            company_website=company_website,
        )
        branch_id = generate_sequence_id("BRN")
        branch = Branch.objects.create(
            company_instance=company,
            branch_id=branch_id,
            branch_full_name=branch_identity_name,
            branch_short_name=branch_identity_name,
            is_main_branch=True,
            password=make_password(password),
            registration_number=registration_number,
            license_number=license_number,
            registration_date=registration_date,
            state_of_recognitation=state_of_recognitation,
            branch_website=company_website,
            phone_number=phone_number,
            emergency_number=emergency_number,
            email=email,
            branch_type_instance=company_type_instance,
            is_available_24_7=is_available_24_7,
            time_from=(None if is_available_24_7 else time_from),
            time_to=( None if is_available_24_7 else time_to),
            area_instance=area_instance,
            city_instance=area_instance.city_instance,
            state_instance=area_instance.state_instance,
            country_instance=area_instance.country_instance,
            address=address,
            branch_description=company_description,
            branch_icon=company_icon,
            branch_logo=company_logo,
            branch_cover=company_cover,
            establish_date=establish_date,
        )
        user.company_instance = company
        user.is_company_setup_completed = True
        user.save()
        return Response(
            {
                "status": "success",
                "subject": "Company Setup",
                "message": "Company setup successful.",
                "data": {
                    "company_id": str(company.id),
                    "company_crn": company.company_crn,
                    "branch_id": branch.branch_id,
                },
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print("Error : ", str(e))
        return Response({ "status": "error", "subject": "Company Setup", "message": "Company setup failed.",},status=status.HTTP_200_OK,)