# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'WebURL'
        db.create_table('particle_weburl_weburl', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal('particle_weburl', ['WebURL'])


    def backwards(self, orm):
        
        # Deleting model 'WebURL'
        db.delete_table('particle_weburl_weburl')


    models = {
        'particle_weburl.weburl': {
            'Meta': {'object_name': 'WebURL'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['particle_weburl']
