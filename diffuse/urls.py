from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^glide/', include('glide.foo.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root':'../media'}),
    url(r'^plans/(?P<slug>[-\w]+)$', 'motes.views.plan_list', name='plan-list'),
    url(r'^motes/cache/(?P<mote_id>\d+)/$', 'motes.views.mote_cache', name='mote_cache'),
    url(r'^motes/push/(?P<plan_id>\d+)/(?P<mote_id>\d+)/$', 'motes.views.mote_push', name='mote_push'),
    url(r'^motes/(?P<mote_id>\d+)/$', 'motes.views.mote_json', name='mote_json'),

    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login',
        name='logout'),

)
