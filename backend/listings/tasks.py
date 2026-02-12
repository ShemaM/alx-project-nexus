from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import Subscription, Job


def _sync_signed_up_users_to_subscribers():
    """
    Ensure all eligible platform account holders are active update subscribers.
    """
    from users.models import User

    eligible_users = User.objects.filter(
        is_superuser=False,
        is_active=True,
        email_notifications=True,
    ).exclude(email="")

    now = timezone.now()
    for user in eligible_users:
        email = (user.email or "").strip().lower()
        if not email:
            continue

        subscription, _ = Subscription.objects.get_or_create(
            email=email,
            defaults={
                "is_active": True,
                "confirmed_at": now,
            },
        )

        updates = {}
        if not subscription.is_active:
            updates["is_active"] = True
        if not subscription.confirmed_at:
            updates["confirmed_at"] = now

        if updates:
            for field, value in updates.items():
                setattr(subscription, field, value)
            subscription.save(update_fields=list(updates.keys()))


@shared_task
def send_subscription_confirmation_email(subscription_id):
    """
    Sends a confirmation email to a new subscriber.
    """
    try:
        subscription = Subscription.objects.get(id=subscription_id)
        if not subscription.is_active:
            confirmation_link = f"{settings.FRONTEND_URL}/confirm-subscription?token={subscription.confirmation_token}"
            
            context = {
                'confirmation_link': confirmation_link,
                'frontend_url': settings.FRONTEND_URL,
            }
            
            subject = 'Confirm Your Subscription to BYN-K Opportunities'
            text_body = render_to_string('listings/emails/subscription_confirmation.txt', context)
            html_body = render_to_string('listings/emails/subscription_confirmation.html', context)

            send_mail(
                subject,
                text_body,
                settings.DEFAULT_FROM_EMAIL,
                [subscription.email],
                html_message=html_body,
                fail_silently=False,
            )
    except Subscription.DoesNotExist:
        # Handle case where subscription might have been deleted
        pass


@shared_task
def send_new_opportunity_notifications():
    """
    Sends new opportunity notifications to all active subscribers.
    This task is scheduled to run daily by Celery Beat.
    """
    _sync_signed_up_users_to_subscribers()
    active_subscriptions = Subscription.objects.filter(is_active=True)
    
    for subscription in active_subscriptions:
        # If the user has never been notified, we can select all jobs from last 24h
        if subscription.last_notified_at:
            new_jobs = Job.objects.filter(
                is_active=True,
                created_at__gt=subscription.last_notified_at
            )
        else:
            new_jobs = Job.objects.filter(
                is_active=True,
                created_at__gte=timezone.now() - timezone.timedelta(days=1)
            )

        if new_jobs.exists():
            context = {
                'jobs': new_jobs,
                'unsubscribe_link': f"{settings.FRONTEND_URL}/unsubscribe?token={subscription.confirmation_token}",
                'frontend_url': settings.FRONTEND_URL,
            }
            
            subject = f'New Opportunities on BYN-K Platform ({new_jobs.count()} new)'
            text_body = render_to_string('listings/emails/new_opportunities.txt', context)
            html_body = render_to_string('listings/emails/new_opportunities.html', context)

            send_mail(
                subject,
                text_body,
                settings.DEFAULT_FROM_EMAIL,
                [subscription.email],
                html_message=html_body,
                fail_silently=False,
            )
            
        subscription.last_notified_at = timezone.now()
        subscription.save()


@shared_task
def send_immediate_opportunity_notification(job_id):
    """
    Sends an immediate notification to all active subscribers when a new opportunity is posted.
    This task should be called from the Job model's save method or admin action.
    """
    _sync_signed_up_users_to_subscribers()

    try:
        job = Job.objects.get(id=job_id, is_active=True)
    except Job.DoesNotExist:
        return
    
    active_subscriptions = Subscription.objects.filter(is_active=True)
    
    for subscription in active_subscriptions:
        context = {
            'job': job,
            'unsubscribe_link': f"{settings.FRONTEND_URL}/unsubscribe?token={subscription.confirmation_token}",
            'frontend_url': settings.FRONTEND_URL,
            'job_url': f"{settings.FRONTEND_URL}/opportunities/{job.slug or job.id}",
        }
        
        subject = f'New Opportunity: {job.title} at {job.organization_name}'
        text_body = render_to_string('listings/emails/single_opportunity.txt', context)
        html_body = render_to_string('listings/emails/single_opportunity.html', context)

        send_mail(
            subject,
            text_body,
            settings.DEFAULT_FROM_EMAIL,
            [subscription.email],
            html_message=html_body,
            fail_silently=True,  # Don't fail for individual emails
        )
