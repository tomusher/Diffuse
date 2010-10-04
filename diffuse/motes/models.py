from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

class Mote(models.Model):
    name = models.CharField(max_length=100)
    plans = models.ManyToManyField('Plan')
    class Meta:
        abstract = True

class Plan(models.Model):
    name = models.CharField(max_length=100)
