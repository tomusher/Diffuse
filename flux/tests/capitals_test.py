import redis
import random
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
        answer = {}
        for i in range(9,12):
            answer[i] = str(random.randrange(9,12))
        string = {'event': 'serverPublishedResponse',
                'data': {
                        'mote_id': 19,
                        'plan': 'plan:1',
                        'message': answer,
                        'client': client,
                        }
                }

        json_string = json.JSONEncoder().encode(string)
        r.publish("plan:1",json_string)
