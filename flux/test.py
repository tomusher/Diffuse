import redis
import random
import simplejson as json
import time

i=0
while i < 1000:
    time.sleep(0.8)
    r = redis.Redis(host='localhost', db=0)
    random_string = random.randrange(1,10000000000000)
    random_answer = random.randrange(1,5)
    string = {'event': 'pubResponse',
            'data': {
                    'mote_id': 9,
                    'plan': 'plan:1',
                    'message': { 'id': random_answer },
                    'client': random_string,
                    }
            }

    json_string = json.JSONEncoder().encode(string)
    r.publish("plan:1",json_string)
