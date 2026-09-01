from django.db import models

class Country(models.Model):
    country_name = models.CharField(max_length=20)
    country_iso_code = models.CharField(max_length=10,null=True,blank=True)
    country_phone_code = models.CharField(max_length=10,null=True,blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()


    def __str__(self):
        return self.country_name
    class Meta:
        db_table = 'country'
        verbose_name = 'Country'
        verbose_name_plural = "Countries"   


class State(models.Model):
    country_instance = models.ForeignKey(Country,on_delete=models.CASCADE)
    state_name = models.CharField(max_length=30)
    state_code = models.CharField(max_length=20,null=True,blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.state_name
    class Meta:
        db_table = 'state'
        verbose_name = 'state'
        verbose_name_plural = "States"


class City(models.Model):
    country_instance = models.ForeignKey(Country,on_delete=models.CASCADE)
    state_instance = models.ForeignKey(State,on_delete=models.CASCADE)
    city_name = models.CharField(max_length=40)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.city_name
    class Meta:
        db_table = 'city'
        verbose_name = 'City'
        verbose_name_plural = "Cities"


class Area(models.Model):
    country_instance = models.ForeignKey(Country,on_delete=models.CASCADE)
    state_instance = models.ForeignKey(State,on_delete=models.CASCADE)
    city_instance = models.ForeignKey(City,on_delete=models.CASCADE,null=True)
    area_name = models.CharField(max_length=40)
    pin_code = models.CharField(max_length=8)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()

    def __str__(self):
        return f"{self.area_name} {self.pin_code}"
    class Meta:
        db_table = 'area'
        verbose_name = 'Area'
        verbose_name_plural = "Areas"

class Nationality(models.Model):
    nationality_name = models.CharField(max_length=200, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'nationality'
        verbose_name = 'Nationality'
        verbose_name_plural = "Nationality"

    def __str__(self):
        return self.nationality_name

class BankNames(models.Model):
    bank_name = models.CharField(max_length=250, null=True, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'bank_names'
        verbose_name = 'Bank Names'
        verbose_name_plural = "Bank Names"

    def __str__(self):
        return self.bank_name


class BankAccountType(models.Model):
    bank_account_type = models.CharField(max_length=250, null=True, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'bank_account_type'
        verbose_name = 'Bank AccountType'
        verbose_name_plural = "Bank AccountType"

    def __str__(self):
        return self.bank_account_type
    
class UpiNames(models.Model):
    upi_names = models.CharField(max_length=250, null=True, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'upi_names'
        verbose_name = 'Upi Names'
        verbose_name_plural = "Upi Names"

    def __str__(self):
        return self.upi_names
    
class Genders(models.Model):
    gender_name = models.CharField(max_length=100)
    gender_short_name = models.CharField(max_length=10, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'genders'
        verbose_name = 'Genders'
        verbose_name_plural = "Genders"

    def __str__(self):
        return self.gender_name
    
class AgeGroup(models.Model):
    age_group_name = models.CharField(max_length=200, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'age_group'
        verbose_name = 'Age Group'
        verbose_name_plural = "Age Group"

    def __str__(self):
        return self.age_group_name
    

class BloodGroup(models.Model):
    blood_group_name = models.CharField(max_length=200, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField()
    class Meta:
        db_table = 'blood_group'
        verbose_name = 'Blood Group'
        verbose_name_plural = "Blood Group"

    def __str__(self):
        return self.blood_group_name
    
# class ActionLogs(models.Model):
#     ACTION_CHOICES = (
#         ('CREATE', 'Create'),
#         ('UPDATE', 'Update'),
#         ('DELETE', 'Delete'),
#         ('CUSTOM', 'CUSTOM')
#     )
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     performed_by = models.ForeignKey('employee.EmployeeProfile', on_delete=models.SET_NULL, null=True, related_name='action_logs')
#     action = models.CharField(max_length=10, choices=ACTION_CHOICES)
#     action_subject = models.CharField(max_length=100, null=True)
#     module_name = models.CharField(max_length=100, null=True)
#     action_message = models.TextField(null=True)
#     performed_at = models.DateTimeField()

#     def __str__(self):
#         return f"{self.action} - {self.performed_by.employee_full_name}"
    
#     class Meta: 
#         db_table = 'action_logs'
#         verbose_name = 'Action Logs'
#         verbose_name_plural = 'Action Logs'
