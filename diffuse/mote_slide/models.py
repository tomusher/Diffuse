from django.db import models
from diffuse.motes.models import Mote

class Slide(Mote):
    content = models.TextField()
    descriptive_name = "Slide"
    identifier = "slide"

    def as_dict(self):
        output = super(Slide, self).as_dict()
        output['data'] = {
            "content": self.content,
        }
        return output
