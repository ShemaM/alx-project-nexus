from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import Subscription, Job

@shared_task
def send_subscription_confirmation_email(subscription_id):
    """
    Sends a confirmation email to a new subscriber.
    """
    try:
        subscription = Subscription.objects.get(id=subscription_id)
        if not subscription.is_active:
            confirmation_link = f"http://localhost:3000/confirm-subscription?token={subscription.confirmation_token}"
            
            context = {
                'confirmation_link': confirmation_link,
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
    """
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
                'unsubscribe_link': f"http://localhost:3000/unsubscribe?token={subscription.confirmation_token}"
            }
            
            subject = 'New Opportunities on BYN-K Platform'
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
