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

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)

    def __str__(self):
         return self.full_name

class TeacherSubjectClass(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)

    def __str__(self):
         return f"{self.teacher} - {self.subject} - {self.classroom}"
         
class Exam(models.Model):
    name = models.CharField(max_length=50)
    term = models.CharField(max_length=10)
    year = models.IntegerField()
    start_date = models.DateField()

    def __str__(self):
         return f"{self.name}"
    
class Mark(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
   
    cat1 = models.PositiveSmallIntegerField(default=0)
    cat2 = models.PositiveSmallIntegerField(default=0)
    exam_score = models.PositiveSmallIntegerField(default=0)
    total = models.PositiveSmallIntegerField(blank=True, null=True)
    grade = models.CharField(max_length=2, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        self.total = self.cat1 + self.cat2 + self.exam_score
        self.grade = self.get_grade()
        super().save(*args, **kwargs)

    def get_grade(self):
        if self.total >= 80:
             return 'A'
        elif self.total >= 70:
             return 'B+'
        elif self.total >= 60:
             return 'B'
        elif self.total >= 50:
             return 'C'
        elif self.total >= 40:
             return 'D'
        else:
             return 'E'

        def __str__(self):
             return f"{self.student} - {self.subject} - {self.exam}"
