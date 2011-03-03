from django.conf.urls.defaults import *
from django.contrib import admin
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from motes.models import Plan, Mote
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^glide/', include('glide.foo.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root':'../static'}),

    # Plans
    url(r'^plans/$',    
                        ListView.as_view(model=Plan), 
                        name="plan_list"),
    url(r'^plans/add/$',  
                        CreateView.as_view(model=Plan), 
                        name="plan_add"),
    url(r'^plans/edit/(?P<pk>\d+)$', 
                        UpdateView.as_view(model=Plan),
                        name="plan_edit"),
    url(r'^plans/delete/(?P<pk>\d+)$', 
                        DeleteView.as_view(model=Plan,
                                           success_url="/plans/"), 
                        name="plan_delete"),
    url(r'^plans/(?P<plan_id>\d+)$', 
                        'motes.views.mote_list', 
                        name='mote_list'),
    
    # Motes
    url(r'^motes/cache/(?P<mote_id>\d+)/$', 
                        'motes.views.mote_cache', 
                        name='mote_cache'),
    url(r'^motes/push/(?P<plan_id>\d+)/(?P<mote_id>\d+)/$', 
                        'motes.views.mote_push', 
                        name='mote_push'),
    url(r'^motes/add/$',
                        CreateView.as_view(model=Mote),
                        name='mote_add'),
    url(r'^motes/(?P<mote_id>\d+)/$', 
                        'motes.views.mote_json', 
                        name='mote_json'),

    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login',
        name='logout'),

)
