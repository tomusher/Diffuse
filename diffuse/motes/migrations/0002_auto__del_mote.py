# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Deleting model 'Mote'
        db.delete_table('motes_mote')

        # Removing M2M table for field motes on 'Plan'
        db.delete_table('motes_plan_motes')


    def backwards(self, orm):
        
        # Adding model 'Mote'
        db.create_table('motes_mote', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('motes', ['Mote'])

        # Adding M2M table for field motes on 'Plan'
        db.create_table('motes_plan_motes', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('plan', models.ForeignKey(orm['motes.plan'], null=False)),
            ('mote', models.ForeignKey(orm['motes.mote'], null=False))
        ))
        db.create_unique('motes_plan_motes', ['plan_id', 'mote_id'])


    models = {
        'motes.plan': {
            'Meta': {'object_name': 'Plan'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['motes']
