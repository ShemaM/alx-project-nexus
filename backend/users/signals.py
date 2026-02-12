from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from listings.models import Subscription
from .models import User


@receiver(post_save, sender=User)
def ensure_user_is_subscription_recipient(sender, instance, created, **kwargs):
    """
    Keep signed-up users in the update notification audience.
    """
    user = instance
    email = (user.email or "").strip().lower()
    if not email or user.is_superuser:
        return

    subscription, _ = Subscription.objects.get_or_create(
        email=email,
        defaults={
            "is_active": True,
            "confirmed_at": timezone.now(),
        },
    )

    if user.email_notifications:
        updates = {}
        if not subscription.is_active:
            updates["is_active"] = True
        if not subscription.confirmed_at:
            updates["confirmed_at"] = timezone.now()
        if updates:
            for field, value in updates.items():
                setattr(subscription, field, value)
            subscription.save(update_fields=list(updates.keys()))
