from django.contrib import admin
from diffuse.particles.models import Particle

class ParticleAdmin(admin.ModelAdmin):
    pass

admin.site.register(Particle, ParticleAdmin)
