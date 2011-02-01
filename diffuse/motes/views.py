from django.http import HttpResponse
from django.core import serializers

from annoying.decorators import render_to
from motes.models import Mote, Plan

import simplejson as json
import redis

@render_to('motes/mote_list.html')
def mote_list(request):
    motes = Mote.objects.all()
    return {'motes': motes}

@render_to('motes/plan_list.html')
def plan_list(request, slug):
    plan = Plan.objects.get(slug=slug)
    motes = plan.motes.all()
    return {'motes': motes}

def mote_json(request, mote_id):
    mote = Mote.objects.get(pk=mote_id)
    json_data = json.dumps(mote.as_dict())
    return HttpResponse(json_data, mimetype='text/plain') #text/plain for debugging, should be application/json

def mote_cache(request, mote_id):
    r = redis.Redis(host='localhost', db=0)
    mote = Mote.objects.get(pk=mote_id)
    json_data = json.dumps(mote.as_dict())
    r.set(mote_id, json_data)

def mote_push(request, plan_id, mote_id):
    r = redis.Redis(host='localhost', db=0)
    mote_cache(request, mote_id)
    r.publish(plan_id, mote_id)
