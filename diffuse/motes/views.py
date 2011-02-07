from django.http import HttpResponse
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from annoying.decorators import render_to
from motes.models import Mote, Plan
import logging

import simplejson as json
import redis

@render_to('motes/plan_list.html')
def plan_list(request, slug):
    plan = Plan.objects.get(slug=slug)
    motes = plan.motes.all()
    return {'plan': plan, 'motes': motes}

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
    channel = Plan.objects.get(pk=plan_id).access_code
    r.set(channel, mote_id)
    r.publish(channel, mote_id)
