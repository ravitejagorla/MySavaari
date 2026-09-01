from django.contrib import admin
from apps.generalservices.models import GlobalSequence

@admin.register(GlobalSequence)
class GlobalSequenceAdminConfig(admin.ModelAdmin):
    list_display = ("prefix", "date", "last_sequence")
    search_fields = ("prefix", "date")
    list_filter = ("date",)
    ordering = ("-date",)
