from django.urls import path
from apps.datamanagement.datamanagement_apis import area_apis

urlpatterns = [
    path('areas/', area_apis.area_search_api, name='area-search'),
]