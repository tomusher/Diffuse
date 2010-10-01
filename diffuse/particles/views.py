from annoying.decorators import render_to
from particles.models import Particle

@render_to('particles/particle_list.html')
def particle_list(request):
    particles = Particle.objects.all()
    return {'particles': particles}
