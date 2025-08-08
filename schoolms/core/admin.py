from django.contrib import admin
from .models import ClassRoom, Subject, Student, Teacher, TeacherSubjectClass, Exam, Mark, Attendance, UserProfile, BlogPost, SchoolInfo

@admin.register(SchoolInfo)
class SchoolInfoAdmin(admin.ModelAdmin):
    list_display = ('school_name', 'location', 'email', 'phone', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('school_name', 'logo')
        }),
        ('Contact Information', {
            'fields': ('po_box', 'phone', 'email', 'location')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

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
admin.site.register(BlogPost)

