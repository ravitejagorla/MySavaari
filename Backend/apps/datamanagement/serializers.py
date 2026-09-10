from rest_framework import serializers
from .models import (
    Country, 
    State, 
    City, 
    Area,
    Genders, 
    AgeGroup, 
    BloodGroup, 
    Nationality,
    CompanyType,
)

class CountryFKSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'country_name']

class StateFKSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'state_name']

class CityFKSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'city_name']

class AreaSerializer(serializers.ModelSerializer):
    country_instance = CountryFKSerializer(read_only=True)
    state_instance = StateFKSerializer(read_only=True)
    city_instance = CityFKSerializer(read_only=True)

    class Meta:
        model = Area
        fields = [
            'id', 'area_name', 'pin_code', 'country_instance', 
            'state_instance', 'city_instance', 'is_active', 'created_at'
        ]

class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genders
        fields = ['id', 'gender_name', 'gender_short_name', 'is_active', 'created_at']

class AgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeGroup
        fields = ['id', 'age_group_name', 'is_active', 'created_at']

class BloodGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodGroup
        fields = '__all__'


# class ActionLogsSerializer(serializers.ModelSerializer):
#     employee_name = serializers.CharField(source='performed_by.employee_full_name')
#     employee_salutation = serializers.CharField(source='performed_by.employee_salutation.salutation_name')
#     class Meta:
#         model = ActionLogs
#         fields = '__all__'
#         extra_fields = ['employee_name', 'employee_salutation']

class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = '__all__'

class CompanyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyType
        fields = '__all__'