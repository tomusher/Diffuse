from django.contrib import admin
from diffuse.mote_html.models import HTML

class HTMLAdmin(admin.ModelAdmin):
    pass
admin.site.register(HTML, HTMLAdmin)

