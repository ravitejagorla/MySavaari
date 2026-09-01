from django.db import models

class GlobalSequence(models.Model):
    prefix = models.CharField(max_length=10)
    date = models.DateField()
    last_sequence = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["prefix", "date"], name="unique_prefix_date_sequence")
        ]

    def __str__(self):
        return f"{self.prefix}-{self.date}"
    