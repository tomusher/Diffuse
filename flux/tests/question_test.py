import redis
import os
import random
import string
import simplejson as json
import time

i=0
clients = ["abcdef", "abcdefg", "absadasd", "sdfdsff", "adfasf", "adft34",
"fdsf35", "354sds", "sdfsdfg4", "sg45849", "4523234", "3453459", "54359rd",
"3259fjswd", "adsffwer", "sdfg85", "sfdgs",]

while i < 100:
    random.shuffle(clients)
    for client in clients:
        time.sleep(0.8)
        r = redis.Redis(host='localhost', db=0)
        answer = ''.join([random.choice(string.letters) for i in xrange(20)])
        answer_dict = {'event': 'serverPublishedResponse',
                'data': {
                        'mote_id': 21,
                        'plan': 'plan:1',
                        'message': answer,
                        'client': client,
                        }
                }

        json_string = json.JSONEncoder().encode(answer_dict)
        r.publish("plan:1",json_string)
