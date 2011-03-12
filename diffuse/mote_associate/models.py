from django.db import models
from django.forms import model_to_dict
from diffuse.motes.models import Mote

class AssociationGroup(Mote):
    description_text = models.CharField(max_length=255)
    descriptive_name = "Association"
    identifier = "association"

    def as_dict(self):
        output = super(AssociationGroup, self).as_dict()
        associations = []
        for a in self.association_set.all():
            associations.append(a.as_dict())

        output['data'] = {
            "description_text": self.description_text,
            "associations": associations,
        }
        return output

class Association(models.Model):
    association_group = models.ForeignKey(AssociationGroup)
    left_side = models.CharField(max_length=255)
    right_side = models.CharField(max_length=255)

    def as_dict(self):
        output = {
            "pk": self.pk,
            "left_side": self.left_side,
            "right_side": self.right_side,
        }
        return output
