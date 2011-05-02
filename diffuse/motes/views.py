from django.http import HttpResponse
from django.db import models
from django.utils import importlib
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView
from annoying.decorators import render_to
from motes.models import Mote, Plan

import simplejson as json
import redis

class PlanListView(ListView):
    context_object_name = "plans"

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return Plan.objects.filter(user=self.request.user)
        return Plan.objects.none()

@login_required
@render_to('motes/plan_view.html')
def plan_view(request, plan_id):
    """ Lists all motes in a selected plan (as specified by the pk)."""

    plan = Plan.objects.get(pk=plan_id)

    if request.user==plan.user:
        motes = plan.motes.all()
        return {'plan': plan, 'motes': motes,}
    else:
        return redirect('login')

@login_required
def plan_star(request, pk):
    plan = Plan.objects.get(pk=pk)

    if request.user==plan.user:
        if plan.starred == True:
            plan.starred = False;
        else:
            plan.starred = True;
        plan.save()
        return HttpResponse(json.dumps({'starred': plan.starred}), mimetype='application/json')
    else:
        return redirect('login')


@login_required
def mote_edit(request, plan_id, mote_id):
    """ Calls mote_edit function of mote type specified in mote_id """
    mote = Mote.objects.get(id=mote_id)
    app = models.get_app(mote._meta.app_label)
    views = importlib.import_module(app.__name__[:-6] + "views")
    return views.mote_edit(request, plan_id, mote_id)

@login_required
def mote_push(request, plan_id, mote_id):
    """ Push the specified mote to the specified plan channel in Redis. """
    plan = Plan.objects.get(pk=plan_id)

    if request.user==plan.user:
        mote = Mote.objects.get(pk=mote_id)
        mote.cache()
        mote.push(plan_id)
        json_data = json.dumps(mote.as_dict())
        return HttpResponse(json_data, mimetype='application/json') #text/plain for debugging, should be application/json
    else:
        return redirect('login')
