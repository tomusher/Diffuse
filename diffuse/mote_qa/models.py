from django.db import models
from django.forms import model_to_dict
from diffuse.motes.models import Mote

class Question(Mote):
    question_text = models.CharField(max_length=255)
    descriptive_name = "Question"
    identifier = "qa"
    
    def as_dict(self):
        output = super(Question, self).as_dict()
        answer = []
        for a in self.answer_set.all():
            answer.append(a.as_dict())

        output['data'] = {
            "question_text": self.question_text,
            "answers": answer,
        }
        return output

class Answer(models.Model):
    question = models.ForeignKey(Question)
    answer_text = models.CharField(max_length=255)
    correct = models.NullBooleanField()

    def as_dict(self):
        output = {
            "pk": self.pk,
            "answer_text": self.answer_text,
            "correct": self.correct,
        }
        return output
