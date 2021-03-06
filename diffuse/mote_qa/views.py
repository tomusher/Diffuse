from django.forms.models import inlineformset_factory
from django.forms import ModelForm
from django.shortcuts import redirect
from motes.models import Plan, Mote
from mote_qa.models import Question, Answer
from annoying.decorators import render_to
import logging

class QuestionForm(ModelForm):
    class Meta:
        model = Question

@render_to("mote_qa/question_form.html")
def mote_edit(request, plan_id, mote_id=None):
    if mote_id:
        question = Question.objects.get(id=mote_id)
    else:
        question = Question()
    
    plan = Plan.objects.get(id=plan_id)
    motes = plan.motes.all();
    AnswerFormSet = inlineformset_factory(Question, Answer)
    formset = AnswerFormSet(instance=question)
    form = QuestionForm(instance=question)

    if request.method == "POST":
        form = QuestionForm(request.POST, instance=question)
        formset = AnswerFormSet(request.POST, instance=question)
        if form.is_valid() and formset.is_valid():
            form.save()
            question.plan_set.add(plan)
            formset.save()
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "formset": formset, "plan": plan, "motes": motes, }
