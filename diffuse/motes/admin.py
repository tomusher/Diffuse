from django.contrib import admin
from diffuse.motes.models import Mote

class MoteAdmin(admin.ModelAdmin):
    pass

admin.site.register(Mote, MoteAdmin)
