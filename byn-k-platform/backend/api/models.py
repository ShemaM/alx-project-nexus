from django.db import models

class Partner(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='partner_logos/', blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Opportunity(models.Model):
    CATEGORY_CHOICES = [
        ('jobs', 'Job'),
        ('internships', 'Internship'),
        ('scholarships', 'Scholarship'),
        ('fellowships', 'Fellowship'),
    ]

    title = models.CharField(max_length=200)
    organization = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='opportunities')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    deadline = models.DateField()
    description = models.TextField()
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    location = models.CharField(max_length=100, blank=True)
    apply_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
