from django.contrib import admin
from .models import ClassRoom, Subject, Student, Teacher, TeacherSubjectClass, Exam, Mark, Attendance, UserProfile

@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_teacher')
    search_fields = ('name',)

admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(TeacherSubjectClass)
admin.site.register(Exam)
admin.site.register(Mark)
admin.site.register(Attendance)
admin.site.register(UserProfile)
