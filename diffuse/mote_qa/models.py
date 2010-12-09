from django.db import models
from django.forms import model_to_dict
from diffuse.motes.models import Mote

class Question(Mote):
    question_text = models.CharField(max_length=255)

    def as_dict(self):
        output = super(Question, self).as_dict()
        answer = []
        for a in self.answer_set.all():
            answer.append(a.answer_text)

        output['data'] = {
            "question_text": self.question_text,
            "answers": answer,
        }
        return output

class Answer(models.Model):
    question = models.ForeignKey(Question)
    answer_text = models.CharField(max_length=255)
