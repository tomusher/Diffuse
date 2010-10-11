from django.db import models
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

class Plan(models.Model):
    name = models.CharField(max_length=100)
    motes = models.ManyToManyField(Mote)
