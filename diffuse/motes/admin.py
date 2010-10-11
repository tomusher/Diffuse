from django.contrib import admin
from django.contrib.contenttypes import generic
from diffuse.motes.models import Mote

class MoteAdmin(admin.ModelAdmin):
    pass

admin.site.register(Mote, MoteAdmin)
