from django.db import models
from django.contrib.auth.models import User
from polymorphic import PolymorphicModel
import redis
import simplejson as json

class Mote(PolymorphicModel):
    name = models.CharField(max_length=100)
    descriptive_name = "Base Mote"
    identifier = "basemote"
    
    def as_dict(self):
        output = {
            "pk": self.pk,
            "name": self.name,
            "descriptive_name": self.descriptive_name,
            "identifier": self.identifier,
            "content_type": self.__class__.__name__,
            "data": None,
        }
        return output

    def cache(self):
        r = redis.Redis(host='localhost', db=0)
        json_data = json.dumps(self.as_dict())
        mote_key = "mote:{0}".format(self.id);
        r.set(mote_key, json_data)

    def push(self, plan_id):
        r = redis.Redis(host='localhost', db=0)
        plan = Plan.objects.get(id=plan_id)
        plan.store_plan()

        latest_mote_key = "plan:{0}:latest_mote".format(plan_id)
        plan_channel = "plan:{0}".format(plan_id)

        r.set(latest_mote_key, self.id)
        json_string = {'event': 'adminPublishedMote', 'data': { 'mote_id': self.id }}
        json_string = json.JSONEncoder().encode(json_string);
        r.publish(plan_channel, json_string); 

    def __unicode__(self):
        return "{0} ({1})".format(self.name, self.__class__.__name__)

class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(blank=True)
    motes = models.ManyToManyField(Mote, blank=True)
    user = models.ForeignKey(User)
    starred = models.BooleanField()

    access_code = models.CharField(max_length=100, unique=True)

    def get_absolute_url(self):
        return "/plans/{0}".format(self.pk)

    def store_plan(self):
        r = redis.Redis(host='localhost', db=0)

        plan_name = self.name
        access_code_key = "plan:{0}".format(self.access_code)
        name_key = "plan:{0}:name".format(self.id)

        r.delete(access_code_key)
        r.delete(name_key)

        r.set(access_code_key, self.id)
        r.set(name_key, plan_name)

    def save(self, *args, **kwargs):
        super(Plan, self).save(*args, **kwargs)
        self.store_plan()

    def delete(self, *args, **kwargs):
        super(Plan, self).delete(*args, **kwargs)
        r = redis.Redis(host='localhost', db=0)

        access_code_key = "plan:{0}".format(self.access_code)
        name_key = "plan:{0}:name".format(self.id)

        r.delete(access_code_key)
        r.delete(name_key)

    def __unicode__(self):
        return self.name
