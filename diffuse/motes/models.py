from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from polymorphic import PolymorphicModel

class Mote(PolymorphicModel):
    name = models.CharField(max_length=100)
    descriptive_name = "Base Mote"
    identifier = "basemote"
    
    def as_dict(self):
        output = {
            "pk": self.pk,
            "name": self.name,
            "descriptive_name": self.descriptive_name,
            "identifier": self.identifier,
            "content_type": self.__class__.__name__,
            "data": None,
        }
        return output

    def __unicode__(self):
        return "{0} ({1})".format(self.name, self.__class__.__name__)

class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(blank=True)
    motes = models.ManyToManyField(Mote, blank=True)
    user = models.ForeignKey(User)

    access_code = models.CharField(max_length=100, unique=True)

    def get_absolute_url(self):
        return "/plans/{0}".format(self.pk)

    def __unicode__(self):
        return self.name
