from django.forms.models import inlineformset_factory
from django.forms import ModelForm
from django.shortcuts import redirect
from motes.models import Plan, Mote
from mote_heatmap.models import Heatmap
from annoying.decorators import render_to
import logging

class HeatmapForm(ModelForm):
    class Meta:
        model = Heatmap

@render_to("mote_heatmap/heatmap_form.html")
def mote_edit(request, plan_id, mote_id=None):
    if mote_id:
        heatmap = Heatmap.objects.get(id=mote_id)
    else:
        heatmap = Heatmap()
        
    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    form = HeatmapForm(instance=heatmap)

    if request.method == "POST":
        form = HeatmapForm(request.POST, request.FILES, instance=heatmap)
        if form.is_valid():
            form.save()
            heatmap.plan_set.add(plan)
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "plan": plan, "motes": motes, }
