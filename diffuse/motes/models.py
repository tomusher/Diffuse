from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

class Mote(models.Model):
    name = models.CharField(max_length=100)
    content_type =  models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    data = generic.GenericForeignKey('content_type', 'object_id')
    
    def as_dict(self):
        output = {
            "pk": self.pk,
            "name": self.name,
            "content_type": self.content_type.get_object_for_this_type().__class__.__name__,
            "data": self.data.as_dict(),
        }
        return output

class Plan(models.Model):
    name = models.CharField(max_length=100)
    motes = models.ManyToManyField(Mote)
