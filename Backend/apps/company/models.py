from django.db import models
from uuid import uuid4
from apps.datamanagement.models import (
    Area,
    City,
    State,
    Country,
    CompanyType
)

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    company_crn = models.CharField(max_length=20)
    company_registered_name = models.CharField(max_length=100)
    company_short_name = models.CharField(max_length=70)

    registration_number = models.CharField(max_length=30)
    license_number = models.CharField(max_length=30, null=True)
    registration_date = models.DateField()
    state_of_recognitation = models.CharField(max_length=250)

    company_website = models.CharField(max_length=250, null=True)
    phone_number = models.CharField(max_length=20)
    emergency_number = models.CharField(max_length=20)
    email = models.EmailField(null=True)
    company_type_instance = models.ForeignKey(CompanyType,on_delete=models.SET_NULL,null=True)
    is_available_24_7 = models.BooleanField(default=False)
    time_from = models.TimeField(null=True)
    time_to = models.TimeField(null=True)

    area_instance = models.ForeignKey(Area,on_delete=models.SET_NULL,null=True)
    city_instance = models.ForeignKey(City,on_delete=models.SET_NULL,null=True)
    state_instance = models.ForeignKey(State,on_delete=models.SET_NULL,null=True)
    country_instance = models.ForeignKey(Country,on_delete=models.SET_NULL,null=True)
    pincode = models.CharField(max_length=20)
    address = models.TextField()

    company_description = models.TextField(null=True)
    company_icon = models.ImageField(upload_to="company_icon")
    company_logo = models.ImageField(upload_to="company_logo")
    company_cover = models.ImageField(upload_to="company_cover",null=True)
    establish_date = models.DateField()
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_registered_name} - {self.company_crn}"

    def save(self, *args, **kwargs):
        if self.area_instance and not self.pincode:
            self.pincode = self.area_instance.pin_code

        super().save(*args, **kwargs)

class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    branch_id = models.CharField(max_length=20)
    company_instance = models.ForeignKey(Company,on_delete=models.CASCADE, related_name='branches', null=True, blank=True)
    branch_full_name = models.CharField(max_length=100)
    branch_short_name = models.CharField(max_length=70)
    is_main_branch = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True, null=True)

    registration_number = models.CharField(max_length=30)
    license_number = models.CharField(max_length=30, null=True)
    registration_date = models.DateField()
    state_of_recognitation = models.CharField(max_length=250)

    branch_website = models.CharField(max_length=250, null=True)
    phone_number = models.CharField(max_length=20)
    emergency_number = models.CharField(max_length=20)
    email = models.EmailField(null=True)
    branch_type_instance = models.ForeignKey(CompanyType,on_delete=models.SET_NULL,null=True)
    is_available_24_7 = models.BooleanField(default=False)
    time_from = models.TimeField(null=True)
    time_to = models.TimeField(null=True)

    area_instance = models.ForeignKey(Area,on_delete=models.SET_NULL,null=True)
    city_instance = models.ForeignKey(City,on_delete=models.SET_NULL,null=True)
    state_instance = models.ForeignKey(State,on_delete=models.SET_NULL,null=True)
    country_instance = models.ForeignKey(Country,on_delete=models.SET_NULL,null=True)
    pincode = models.CharField(max_length=20)
    address = models.TextField()

    branch_description = models.TextField(null=True)
    branch_icon = models.ImageField(upload_to="branch_icon")
    branch_logo = models.ImageField(upload_to="branch_logo")
    branch_cover = models.ImageField(upload_to="branch_cover",null=True)
    establish_date = models.DateField()
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.branch_registered_name} - {self.branch_id}"

    def save(self, *args, **kwargs):
        if self.area_instance and not self.pincode:
            self.pincode = self.area_instance.pin_code

        super().save(*args, **kwargs)
