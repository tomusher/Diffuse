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
    """Lists all motes in a selected plan (as specified by the slug)."""

    plan = Plan.objects.get(slug=slug)
    motes = plan.motes.all()
    return {'plan': plan, 'motes': motes}

def mote_json(request, mote_id):
    """Returns a HTTP application/json response of the specified mote in
    JSON."""

    mote = Mote.objects.get(pk=mote_id)
    json_data = json.dumps(mote.as_dict())
    return HttpResponse(json_data, mimetype='text/plain') #text/plain for debugging, should be application/json

def mote_cache(request, mote_id):
    """Cache the mote's JSON representation in Redis."""

    r = redis.Redis(host='localhost', db=0)
    mote = Mote.objects.get(pk=mote_id)
    json_data = json.dumps(mote.as_dict())
    mote_key = "mote:{0}".format(mote_id);
    r.set(mote_key, json_data)

def mote_push(request, plan_id, mote_id):
    """Push the specified mote to the specified plan channel in Redis."""

    r = redis.Redis(host='localhost', db=0)
    mote_cache(request, mote_id)

    plan_access_code = Plan.objects.get(pk=plan_id).access_code
    access_code_key = "plan:{0}".format(plan_access_code)
    latest_mote_key = "plan:{0}:latest_mote".format(plan_id)
    plan_channel = "plan:{0}".format(plan_id)

    r.set(access_code_key, plan_id)
    r.set(latest_mote_key, mote_id)
    json_string = {'event': 'pubMote', 'data': { 'mote_id': mote_id }}
    json_string = json.JSONEncoder().encode(json_string);
    r.publish(plan_channel, json_string); 

    return mote_json(request, mote_id)
