# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'WebURL'
        db.create_table('mote_weburl_weburl', (
            ('mote_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['motes.Mote'], unique=True, primary_key=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal('mote_weburl', ['WebURL'])


    def backwards(self, orm):
        
        # Deleting model 'WebURL'
        db.delete_table('mote_weburl_weburl')


    models = {
        'mote_weburl.weburl': {
            'Meta': {'object_name': 'WebURL', '_ormbases': ['motes.Mote']},
            'mote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['motes.Mote']", 'unique': 'True', 'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        'motes.mote': {
            'Meta': {'object_name': 'Mote'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['mote_weburl']
