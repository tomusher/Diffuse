from django.contrib import admin
from diffuse.mote_html.models import Map

class MapAdmin(admin.ModelAdmin):
    pass
admin.site.register(Map, MapAdmin)

