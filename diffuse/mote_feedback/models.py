from django.db import models
from django.forms import model_to_dict
from diffuse.motes.models import Mote

class Feedback(Mote):
    description = models.CharField(max_length=1000)
    descriptive_name = "Feedback"
    identifier = "feedback"
    
    def as_dict(self):
        output = super(Feedback, self).as_dict()

        output['data'] = {
            "description": self.description,
        }
        return output
