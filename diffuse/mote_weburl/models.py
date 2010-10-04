from django.db import models
from motes.models import Mote

class WebURL(Mote):
    url = models.URLField()
