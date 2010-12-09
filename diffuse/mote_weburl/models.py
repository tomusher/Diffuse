from django.db import models
from diffuse.motes.models import Mote

class WebURL(Mote):
    url = models.URLField(max_length=400)

    def as_dict(self):
        output = super(WebURL, self).as_dict()
        output['data'] = {
            "url": self.url,
        }
        return output
