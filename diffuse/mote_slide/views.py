from django import forms
from django.forms import ModelForm
from django.shortcuts import redirect
from motes.models import Plan
from mote_slide.models import Slide
from annoying.decorators import render_to
from tinymce.widgets import TinyMCE

class SlideForm(ModelForm):
    content = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30,},
        mce_attrs={
            'theme': 'advanced',
            'theme_advanced_toolbar_location': 'top',
            'theme_advanced_toolbar_align': 'left',
            'theme_advanced_buttons1': 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,fontsizeselect',
            'theme_advanced_buttons2': 'bullist,numlist,|,undo,redo,|,code',
            'theme_advanced_buttons3': '',
    }))

    class Meta:
        model = Slide

@render_to("mote_slide/slide_form.html")
def mote_edit(request, plan_id, mote_id=None):
    if mote_id:
        slide = Slide.objects.get(id=mote_id)
    else:
        slide = Slide()
    
    plan = Plan.objects.get(pk=plan_id)
    motes = plan.motes.all();
    form = SlideForm(instance=slide)

    if request.method == "POST":
        form = SlideForm(request.POST, instance=slide)
        if form.is_valid():
            form.save()
            slide.plan_set.add(plan)
            return redirect('plan_view', plan_id=plan_id)

    return { "form": form, "plan": plan, "motes": motes, }
