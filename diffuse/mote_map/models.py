from django.db import models
from diffuse.motes.models import Mote

class Map(Mote):
    lat = models.CharField(max_length=255)
    lng = models.CharField(max_length=255)
    zoom = models.CharField(max_length=255)

    def as_dict(self):
        output = super(Map, self).as_dict()
        output['data'] = {
            "lat": self.lat,
            "lng": self.lng,
            "zoom": self.zoom,
        }
        return output
