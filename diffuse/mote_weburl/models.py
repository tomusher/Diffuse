from django.db import models

class WebURL(models.Model):
    url = models.URLField()
