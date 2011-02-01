from django.contrib import admin
from django.contrib.contenttypes import generic
from diffuse.motes.models import Mote, Plan

class MoteAdmin(admin.ModelAdmin):
    pass

class MoteInline(admin.TabularInline):
    model = Plan.motes.through

class PlanAdmin(admin.ModelAdmin):
    fields = ('name','slug')
    prepopulated_fields = {'slug':('name',),}
    inlines = [
        MoteInline,
    ]

    def save_model(self, request, obj, form, change):
        instance = form.save(commit=False)
        instance.user = request.user
        instance.save()
        form.save_m2m()
        return instance

admin.site.register(Mote, MoteAdmin)
admin.site.register(Plan, PlanAdmin)
