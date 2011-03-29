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
def create_mote(request, plan_id):
    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    form = HeatmapForm()

    if request.method == "POST":
        form = HeatmapForm(request.POST, request.FILES)
        if form.is_valid():
            heatmap = form.save()
            heatmap.plan_set.add(plan)
            heatmap.save()
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "plan": plan, "motes": motes, }

@render_to("mote_heatmap/heatmap_form.html")
def mote_edit(request, plan_id, mote_id):
    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    feedback = Heatmap.objects.get(id=mote_id)
    form = HeatmapForm(instance=feedback)

    if request.method == "POST":
        form = HeatmapForm(request.POST, request.FILES, instance=feedback)
        if form.is_valid():
            form.save()
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "plan": plan, "motes": motes, }
