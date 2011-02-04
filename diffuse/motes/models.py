from django.db import models
from django.contrib.auth.models import User
from polymorphic import PolymorphicModel

class Mote(PolymorphicModel):
    name = models.CharField(max_length=100)
    
    def as_dict(self):
        output = {
            "pk": self.pk,
            "name": self.name,
            "content_type": self.__class__.__name__,
            "data": None,
        }
        return output

    def __unicode__(self):
        return "{0} ({1})".format(self.name, self.__class__.__name__)

class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    motes = models.ManyToManyField(Mote)
    user = models.ForeignKey(User)

    access_code = models.CharField(max_length=100, unique=True)

    def __unicode__(self):
        return self.name
