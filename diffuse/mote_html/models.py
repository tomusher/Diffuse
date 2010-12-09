from django.db import models
from diffuse.motes.models import Mote

class HTML(Mote):
    raw_html = models.TextField()

    def as_dict(self):
        output = super(HTML, self).as_dict()
        output['data'] = {
            "raw_html": self.raw_html,
        }
        return output
