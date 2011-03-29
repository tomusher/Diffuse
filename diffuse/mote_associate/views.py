from django.forms.models import inlineformset_factory
from django.forms import ModelForm
from django.shortcuts import redirect
from motes.models import Plan
from mote_associate.models import AssociationGroup, Association
from annoying.decorators import render_to

class AssociationGroupForm(ModelForm):
    class Meta:
        model = AssociationGroup

@render_to("mote_associate/associationgroup_form.html")
def create_mote(request, plan_id):
    plan = Plan.objects.get(pk=plan_id)
    motes = plan.motes.all();
    AssociationFormSet = inlineformset_factory(AssociationGroup, Association)
    formset = AssociationFormSet()
    form = AssociationGroupForm()

    if request.method == "POST":
        form = AssociationGroupForm(request.POST)
        if form.is_valid():
            association_group = form.save(commit=False)
            formset = AssociationFormSet(request.POST, request.FILES,
                        instance=association_group)
            if formset.is_valid():
                association_group.save()
                association_group.plan_set.add(plan)
                formset.save()
                return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "formset": formset, "plan": plan, "motes": motes, }

@render_to("mote_associate/associationgroup_form.html")
def mote_edit(request, plan_id, mote_id):
    association = AssociationGroup.objects.get(id=mote_id)
    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    AssociationFormSet = inlineformset_factory(AssociationGroup, Association)
    formset = AssociationFormSet(instance=association)
    form = AssociationGroupForm(instance=association)

    if request.method == "POST":
        form = AssociationGroupForm(request.POST, instance=association)
        formset = AssociationFormSet(request.POST, instance=association)
        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "formset": formset, "plan": plan, "motes": motes, }

