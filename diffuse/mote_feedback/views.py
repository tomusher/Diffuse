from django.forms.models import inlineformset_factory
from django.forms import ModelForm
from motes.models import Plan, Mote
from mote_feedback.models import Feedback
from annoying.decorators import render_to
import logging

class FeedbackForm(ModelForm):
    class Meta:
        model = Feedback

@render_to("mote_feedback/feedback_form.html")
def mote_edit(request, plan_id, mote_id=None):
    if mote_id:
        feedback = Feedback.objects.get(id=mote_id)
    else:
        feedback = Feedback()

    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    form = FeedbackForm(instance=feedback)

    if request.method == "POST":
        form = FeedbackForm(request.POST, instance=feedback)
        if form.is_valid():
            form.save()
            feedback.plan_set.add(plan)
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "plan": plan, "motes": motes, }
