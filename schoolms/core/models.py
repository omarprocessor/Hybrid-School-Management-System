from django.db import models
from django.contrib.auth.models import User

class ClassRoom(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
         return self.name

class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)
    elective = models.BooleanField(default=False)

    def __str__(self):
         return self.name

class Student(models.Model):
    admission_no = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)

    def __str__(self):
         return self.full_name