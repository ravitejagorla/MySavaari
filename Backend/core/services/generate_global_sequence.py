from django.db import IntegrityError, transaction
from django.db.models import F
from django.utils import timezone
import time
from apps.generalservices.models import GlobalSequence

MAX_RETRIES = 5
def generate_sequence_id(prefix, format_type="%y%m%d", padding_format="03d"):
    today = timezone.localdate()
    date_str = today.strftime(format_type)
    for attempt in range(MAX_RETRIES):
        try:
            with transaction.atomic():
                sequence, _ = (
                    GlobalSequence.objects
                    .select_for_update()
                    .get_or_create(
                        prefix=prefix,
                        date=today,
                        defaults={
                            "last_sequence": 0
                        },
                    )
                )
                sequence.last_sequence = (F("last_sequence") + 1)
                sequence.save(update_fields=["last_sequence"])
                sequence.refresh_from_db()
                padded_sequence = format(sequence.last_sequence, padding_format)
                return f"{prefix}{date_str}{padded_sequence}"
        except IntegrityError:
            if attempt == MAX_RETRIES - 1:
                raise
            time.sleep(0.01)