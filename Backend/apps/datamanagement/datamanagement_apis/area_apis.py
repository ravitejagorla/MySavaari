from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.datamanagement.models import (
    Area,
)
from apps.datamanagement.serializers import (
    AreaSerializer,
)

@api_view(["GET"])
@permission_classes([AllowAny])
def area_search_api(request):
    search_query = request.query_params.get("search", "").strip()

    queryset = (
        Area.objects
        .filter(is_active=True)
        .select_related(
            "country_instance",
            "state_instance",
            "city_instance",
        )
    )

    if search_query:
        queryset = queryset.filter(
            Q(area_name__icontains=search_query)
            | Q(pin_code__exact=search_query)
        )

    queryset = queryset.order_by("area_name")[:20]

    serializer = AreaSerializer(queryset, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )