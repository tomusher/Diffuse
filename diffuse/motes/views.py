from django.core import seralizers

from annoying.decorators import render_to
from motes.models import Particle

@render_to('motes/mote_list.html')
def mote_list(request):
    motes = Motes.objects.all()
    return {'motes': motes}

def mote_json(request, mote_id):
    mote = Motes.objects.get(pk=mote_id)
    json = serializers.seralize("json", mote)
    return json

