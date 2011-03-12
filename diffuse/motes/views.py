from django.http import HttpResponse
from django.conf import settings
from django.db import models
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
from django.utils import importlib
from annoying.decorators import render_to
from motes.models import Mote, Plan
import logging

import simplejson as json
import redis

@render_to('motes/plan_view.html')
def plan_view(request, plan_id):
    """Lists all motes in a selected plan (as specified by the pk)."""

    plan = Plan.objects.get(pk=plan_id)
    motes = plan.motes.all()
    mote_types = []
    for mote_type in settings.ENABLED_MOTE_TYPES:
        model = models.loading.get_model(mote_type['app'], mote_type['mote_type'])  
        mote_types.append({
            'name': model.descriptive_name,
            'identifier': mote_type['identifier'],
        }) 
    return {'plan': plan, 'motes': motes, 'mote_types': mote_types}

def mote_edit(request, plan_id, mote_id):
    mote = Mote.objects.get(id=mote_id)
    app = models.get_app(mote._meta.app_label)
    views = importlib.import_module(app.__name__[:-6] + "views")
    return views.mote_edit(request, plan_id, mote_id)

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

    plan = Plan.objects.get(pk=plan_id)
    plan_access_code = plan.access_code
    plan_name = plan.name
    access_code_key = "plan:{0}".format(plan_access_code)
    latest_mote_key = "plan:{0}:latest_mote".format(plan_id)
    name_key = "plan:{0}:name".format(plan_id)

    plan_channel = "plan:{0}".format(plan_id)

    r.set(access_code_key, plan_id)
    r.set(latest_mote_key, mote_id)
    r.set(name_key, plan_name)
    json_string = {'event': 'adminPublishedMote', 'data': { 'mote_id': mote_id }}
    json_string = json.JSONEncoder().encode(json_string);
    r.publish(plan_channel, json_string); 

    return mote_json(request, mote_id)
