from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from motes.models import Plan, Mote
from motes.views import PlanListView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^glide/', include('glide.foo.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root':'../media'}),

    url(r'^tinymce/', include('tinymce.urls')),

    # Plans
    url(r'^$',
                        PlanListView.as_view(),
                        name="plan_list"),
    url(r'^plans/$',    
                        PlanListView.as_view(), 
                        name="plan_list"),
    url(r'^plans/create/$',  
                        CreateView.as_view(model=Plan), 
                        name="plan_add"),
    url(r'^plans/edit/(?P<pk>\d+)$', 
                        UpdateView.as_view(model=Plan),
                        name="plan_edit"),
    url(r'^plans/delete/(?P<pk>\d+)$', 
                        DeleteView.as_view(model=Plan,
                                           success_url="/plans/"), 
                        name="plan_delete"),
    url(r'^plans/star/(?P<pk>\d+)$', 
                        'motes.views.plan_star',
                        name="plan_star"),
    url(r'^plans/(?P<plan_id>\d+)$', 
                        'motes.views.plan_view', 
                        name='plan_view'),
    url(r'^plans/(?P<plan_id>\d+)/edit/(?P<mote_id>\d+)$',
                        'motes.views.mote_edit',
                        name='mote_edit'),
    url(r'^plans/(?P<plan_id>\d+)/delete/(?P<pk>\d+)$',
                        DeleteView.as_view(model=Mote,
                                           template_name="motes/mote_confirm_delete.html",
                                           success_url="/plans/"),
                        name='mote_delete'),
    
    # Motes
    url(r'^plans/(?P<plan_id>\d+)/push/(?P<mote_id>\d+)/$', 
                        'motes.views.mote_push', 
                        name='mote_push'),
    url(r'^plans/(?P<plan_id>\d+)/#!push/(?P<mote_id>\d+)/$',
                        'motes.views.mote_push',
                        name='mote_push_dynamic'),

    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login',
        name='logout'),
)

for mote_type in settings.ENABLED_MOTE_TYPES:
    urlpatterns.append(url(r'^plans/(?P<plan_id>\d+)/add/{0}$'.format(mote_type['identifier']),
                        '{0}.views.mote_edit'.format(mote_type['app']),
                        name='plan_add_{0}'.format(mote_type['identifier'])))

urlpatterns += staticfiles_urlpatterns()
