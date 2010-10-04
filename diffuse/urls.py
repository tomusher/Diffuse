from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^glide/', include('glide.foo.urls')),

    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^motes/$', 'motes.views.mote_list'),
    (r'^motes/(?P<mote_id>\d+)/$', 'motes.views.mote_json'),

)
