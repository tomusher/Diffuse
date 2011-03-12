from django.contrib import admin
from diffuse.mote_associate.models import AssociationGroup, Association

class AssociationInline(admin.TabularInline):
    model = Association

class AssociationGroupAdmin(admin.ModelAdmin):
    inlines = [
        AssociationInline
    ]
admin.site.register(AssociationGroup, AssociationGroupAdmin)

