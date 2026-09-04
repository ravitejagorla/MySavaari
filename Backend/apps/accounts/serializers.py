from rest_framework import serializers
from apps.accounts.models import User, UserAdmin, UserCustomer, OTP

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id", "profile_picture", "first_name", "middle_name", "last_name", 
            "role", "email", "phone", "is_email_verified", "is_phone_verified", 
            "password", "passcode", "is_lockscreen_enabled", "is_locked", "terms_and_conditions", 
            "is_active", "created_at"
        )

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdmin
        fields = ("id", "user", "admin_id", "created_at")

class UserCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCustomer
        fields = ("id", "user", "customer_id", "created_at")

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ("id", "user", "otp_type", "otp_used", "expires_at", "created_at")

class CurrentUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ( 
            "id", "profile_picture", "first_name", "middle_name", "last_name", 
            "role", "email", "phone", "is_email_verified", "is_phone_verified",
        )
    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request is not None:
            relative_url = obj.profile_picture.url
            return request.build_absolute_uri(relative_url)
        return None