import redis
import random
import simplejson as json
import time

i=0
clients = ["abcdef", "abcdefg", "absadasd", "sdfdsff", "adfasf", "adft34",
"fdsf35", "354sds", "sdfsdfg4", "sg45849"]

while i < 100:
    random.shuffle(clients)
    for client in clients:
        time.sleep(0.8)
        r = redis.Redis(host='localhost', db=0)
        random_string = random.randrange(1,10000000000000)
        random_answer = random.randrange(1,10000000000000)
        string = {'event': 'serverPublishedResponse',
                'data': {
                        'mote_id': 22,
                        'plan': 'plan:1',
                        'message': random_answer ,
                        'client': client,
                        }
                }

        json_string = json.JSONEncoder().encode(string)
        r.publish("plan:1",json_string)
