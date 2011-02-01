from django import forms

class MoteForm(forms.Form):
    name = forms.CharField(max_length=100)

