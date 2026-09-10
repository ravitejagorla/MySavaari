from django.urls import path
from apps.company.company_apis import company_setup

urlpatterns = [
    path('company-setup/', company_setup.company_setup, name='company-setup'),
]