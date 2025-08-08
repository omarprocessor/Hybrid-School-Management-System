from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class SchoolInfo(models.Model):
    school_name = models.CharField(max_length=200, default="SCHOOL MANAGEMENT SYSTEM")
    po_box = models.CharField(max_length=50, default="P.O. Box: 12345 - 00100")
    phone = models.CharField(max_length=50, default="TEL: 020-1234567 / 0720-123456")
    location = models.CharField(max_length=100, default="NAIROBI")
    email = models.EmailField(default="info@schoolms.com")
    logo = models.ImageField(upload_to='school_logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "School Information"
        verbose_name_plural = "School Information"

    def __str__(self):
        return self.school_name

    def save(self, *args, **kwargs):
        # Ensure only one school info record exists
        if not self.pk and SchoolInfo.objects.exists():
            return
        super().save(*args, **kwargs)

class ClassRoom(models.Model):
    name = models.CharField(max_length=20)
    class_teacher = models.OneToOneField('Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='classroom_as_teacher')

    def __str__(self):
         return self.name

class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)
    elective = models.BooleanField(default=False)

    def __str__(self):
         return self.name

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    admission_no = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    parent_phone = models.CharField(max_length=15, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
         return self.full_name

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

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
    exam_score = models.PositiveSmallIntegerField(default=0)
    total = models.PositiveSmallIntegerField(blank=True, null=True)
    grade = models.CharField(max_length=2, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        self.total = self.exam_score
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.exam}"


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time_in = models.TimeField()
    time_out = models.TimeField(blank=True, null=True)

    def __str__(self):
         return f"{self.student.admission_no} - {self.student.full_name} - {self.date}"

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    requested_role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_approved = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role if self.role else 'pending'})"

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/')
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure uniqueness
            counter = 1
            orig_slug = self.slug
            while BlogPost.objects.filter(slug=self.slug).exists():
                self.slug = f"{orig_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title