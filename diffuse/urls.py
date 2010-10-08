from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^glide/', include('glide.foo.urls')),

    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^motes/$', 'motes.views.mote_list'),
    url(r'^motes/cache/(?P<mote_id>\d+)/$', 'motes.views.mote_cache', name='mote_cache'),
    url(r'^motes/push/(?P<plan_id>\d+)/(?P<mote_id>\d+)/$', 'motes.views.mote_push', name='mote_push'),
    url(r'^motes/(?P<mote_id>\d+)/$', 'motes.views.mote_json', name='mote_json'),

)
