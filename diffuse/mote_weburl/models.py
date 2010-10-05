from django.db import models

class WebURL(models.Model):
    url = models.URLField()

    def as_dict(self):
        output = {
            "url": self.url,
        }

        return output
