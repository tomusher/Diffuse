from django.db import models
from diffuse.motes.models import Mote

class Message(Mote):
    message_text = models.CharField(max_length=255)

    def as_dict(self):
        output = super(Message, self).as_dict()
        output['data'] = {
            "message_text": self.message_text,
        }
        return output
