from django.http import HttpResponse
from django.core import serializers

from annoying.decorators import render_to
from motes.models import Mote

@render_to('motes/mote_list.html')
def mote_list(request):
    motes = Mote.objects.all()
    return {'motes': motes}

def mote_json(request, mote_id):
    mote = Mote.objects.get(pk=mote_id)
    json = serializers.serialize("json", [mote])
    return HttpResponse(json, mimetype='application/json')

