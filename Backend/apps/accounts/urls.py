from django.urls import path
from apps.accounts.accounts_routes import auth_routes

urlpatterns = [

]

urlpatterns += auth_routes.urlpatterns