from django.urls import path
from . import views

urlpatterns = [
    # ClassRoom
    path('classrooms/', views.ClassRoomListCreateView.as_view(), name='classroom-list'),
    path('classrooms/<int:id>/', views.ClassRoomDetailView.as_view(), name='classroom-detail'),
    #Subject
    path('subjects/', views.SubjectListCreateView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view(), name='subject-detail'),
    # Student
    path('students/', views.StudentListCreateView.as_view(), name='student-list'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    # Teacher
    path('teachers/', views.TeacherListCreateView.as_view(), name='teacher-list'),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view(), name='teacher-detail'),
    # TeacherSubjectClass
    path('assignments/', views.TeacherSubjectClassListCreateView.as_view(), name='assignment-list'),
    path('assignments/<int:pk>/', views.TeacherSubjectClassDetailView.as_view(), name='assignment-detail'),
    # Exam
    path('exams/', views.ExamListCreateView.as_view(), name='exam-list'),
    path('exams/<int:pk>/', views.ExamDetailView.as_view(), name='exam-detail'),
    # Mark
    path('marks/', views.MarkListCreateView.as_view(), name='mark-list'),
    path('marks/<int:pk>/', views.MarkDetailView.as_view(), name='mark-detail'),

     # Attendance
    path('attendance/', views.AttendanceCreateView.as_view(), name='attendance-create'),
    path('attendance/list/', views.AttendanceListView.as_view(), name='attendance-list'),
]





   
