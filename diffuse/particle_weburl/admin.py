from django.contrib import admin
from diffuse.particle_weburl.models import WebURL

class WebURLAdmin(admin.ModelAdmin):
    pass
admin.site.register(WebURL, WebURLAdmin)
