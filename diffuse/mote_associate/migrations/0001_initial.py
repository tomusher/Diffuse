# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'AssociationGroup'
        db.create_table('mote_associate_associationgroup', (
            ('mote_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['motes.Mote'], unique=True, primary_key=True)),
            ('question_text', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('mote_associate', ['AssociationGroup'])

        # Adding model 'Association'
        db.create_table('mote_associate_association', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('association_group', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['mote_associate.AssociationGroup'])),
            ('left_side', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('right_side', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('mote_associate', ['Association'])


    def backwards(self, orm):
        
        # Deleting model 'AssociationGroup'
        db.delete_table('mote_associate_associationgroup')

        # Deleting model 'Association'
        db.delete_table('mote_associate_association')


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
            'mote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['motes.Mote']", 'unique': 'True', 'primary_key': 'True'}),
            'question_text': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'motes.mote': {
            'Meta': {'object_name': 'Mote'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'polymorphic_ctype': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'polymorphic_motes.mote_set'", 'null': 'True', 'to': "orm['contenttypes.ContentType']"})
        }
    }

    complete_apps = ['mote_associate']
