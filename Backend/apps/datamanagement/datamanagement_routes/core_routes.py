from django.urls import path
from Backend.apps.datamanagement.datamanagement_apis import core_apis

urlpatterns = [
    path('areas/', core_apis.area_search_api, name='area-search'),
    path('company-types/', core_apis.company_type_api, name='company-type'),
]