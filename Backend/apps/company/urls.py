from django.urls import path
from apps.company.company_routes import company_setup 

urlpatterns = [

]

urlpatterns += company_setup.urlpatterns