# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting field 'AssociationGroup.question_text'
        db.delete_column('mote_associate_associationgroup', 'question_text')

        # Adding field 'AssociationGroup.description_text'
        db.add_column('mote_associate_associationgroup', 'description_text', self.gf('django.db.models.fields.CharField')(default='na', max_length=255), keep_default=False)


    def backwards(self, orm):
        
        # Adding field 'AssociationGroup.question_text'
        db.add_column('mote_associate_associationgroup', 'question_text', self.gf('django.db.models.fields.CharField')(default='na', max_length=255), keep_default=False)

        # Deleting field 'AssociationGroup.description_text'
        db.delete_column('mote_associate_associationgroup', 'description_text')


    models = {
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'mote_associate.association': {
            'Meta': {'object_name': 'Association'},
            'association_group': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['mote_associate.AssociationGroup']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'left_side': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'right_side': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'mote_associate.associationgroup': {
            'Meta': {'object_name': 'AssociationGroup', '_ormbases': ['motes.Mote']},
            'description_text': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'mote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['motes.Mote']", 'unique': 'True', 'primary_key': 'True'})
        },
        'motes.mote': {
            'Meta': {'object_name': 'Mote'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'polymorphic_ctype': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'polymorphic_motes.mote_set'", 'null': 'True', 'to': "orm['contenttypes.ContentType']"})
        }
    }

    complete_apps = ['mote_associate']
