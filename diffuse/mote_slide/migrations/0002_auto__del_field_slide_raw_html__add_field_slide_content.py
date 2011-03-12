# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting field 'Slide.raw_html'
        db.delete_column('mote_slide_slide', 'raw_html')

        # Adding field 'Slide.content'
        db.add_column('mote_slide_slide', 'content', self.gf('django.db.models.fields.TextField')(default='na'), keep_default=False)


    def backwards(self, orm):
        
        # Adding field 'Slide.raw_html'
        db.add_column('mote_slide_slide', 'raw_html', self.gf('django.db.models.fields.TextField')(default='na'), keep_default=False)

        # Deleting field 'Slide.content'
        db.delete_column('mote_slide_slide', 'content')


    models = {
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'mote_slide.slide': {
            'Meta': {'object_name': 'Slide', '_ormbases': ['motes.Mote']},
            'content': ('django.db.models.fields.TextField', [], {}),
            'mote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['motes.Mote']", 'unique': 'True', 'primary_key': 'True'})
        },
        'motes.mote': {
            'Meta': {'object_name': 'Mote'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'polymorphic_ctype': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'polymorphic_motes.mote_set'", 'null': 'True', 'to': "orm['contenttypes.ContentType']"})
        }
    }

    complete_apps = ['mote_slide']
