from django.db import models
from motes.models import Plan
from django.conf import settings

def user_starred_plans(request):
    plans = []
    if request.user.is_authenticated():
        plans = Plan.objects.filter(user=request.user,starred=True)
    return {'starred_plans':plans}

def mote_types(request):
    mote_types = []
    for mote_type in settings.ENABLED_MOTE_TYPES:
        model = models.loading.get_model(mote_type['app'], mote_type['mote_type'])  
        mote_types.append({
            'name': model.descriptive_name,
            'identifier': mote_type['identifier'],
        }) 
    return {'mote_types':mote_types}
