from django.db import models
from django.forms import model_to_dict
from diffuse.motes.models import Mote

class Heatmap(Mote):
    description = models.CharField(max_length=1000)
    image = models.ImageField(upload_to="heatmap/%Y/%m/%d")
    descriptive_name = "Heatmap"
    identifier = "heatmap"
    
    def as_dict(self):
        output = super(Heatmap, self).as_dict()

        output['data'] = {
            "description": self.description,
            "image": self.image.url,
        }
        return output
