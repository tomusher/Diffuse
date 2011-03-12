from django.contrib import admin
from diffuse.mote_slide.models import Slide

class SlideAdmin(admin.ModelAdmin):
    pass
admin.site.register(Slide, SlideAdmin)

