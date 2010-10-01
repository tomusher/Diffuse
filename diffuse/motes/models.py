from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

class Mote(models.Model):
    name = models.CharField(max_length=100)
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    data = generic.GenericForeignKey('content_type', 'object_id')

class Plan(models.Model):
    name = models.CharField(max_length=100)
    motes = models.ManyToManyField(Mote)
