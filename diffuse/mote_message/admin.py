from django.contrib import admin
from diffuse.mote_message.models import Message

class MessageAdmin(admin.ModelAdmin):
    pass
admin.site.register(Message, MessageAdmin)

