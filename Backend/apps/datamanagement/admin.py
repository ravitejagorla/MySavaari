from django.contrib import admin
from .models import (
    Country,
    State,
    City,
    Area,
    Nationality,
    BankNames,
    BankAccountType,
    UpiNames,
    Genders,
    AgeGroup,
    BloodGroup
)

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('country_name','country_iso_code','country_phone_code','is_active','created_at')
    search_fields = ('country_name','country_iso_code','country_phone_code')

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('state_name','state_code','is_active','created_at')
    search_fields = ('state_name','state_code')

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('city_name','is_active','created_at')
    search_fields = ('city_name',)

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('area_name','pin_code','is_active','created_at')
    search_fields = ('area_name','pin_code')

@admin.register(Nationality)
class NationalityAdmin(admin.ModelAdmin):
    list_display = ('nationality_name','is_active','created_at')
    search_fields = ('nationality_name',)

@admin.register(BankNames)
class BankNamesAdmin(admin.ModelAdmin):
    list_display = ('bank_name','is_active','created_at')
    search_fields = ('bank_name',)

@admin.register(BankAccountType)
class BankAccountTypeAdmin(admin.ModelAdmin):
    list_display = ('bank_account_type','is_active','created_at')
    search_fields = ('bank_account_type',)

@admin.register(UpiNames)
class UpiNamesAdmin(admin.ModelAdmin):
    list_display = ('upi_names','is_active','created_at')
    search_fields = ('upi_names',)

@admin.register(Genders)
class GendersAdmin(admin.ModelAdmin):
    list_display = ('gender_name','gender_short_name','is_active','created_at')
    search_fields = ('gender_name','gender_short_name')

@admin.register(AgeGroup)
class AgeGroupAdmin(admin.ModelAdmin):
    list_display = ('age_group_name','is_active','created_at')
    search_fields = ('age_group_name',)

@admin.register(BloodGroup)
class BloodGroupAdmin(admin.ModelAdmin):
    list_display = ('blood_group_name','is_active','created_at')
    search_fields = ('blood_group_name',)