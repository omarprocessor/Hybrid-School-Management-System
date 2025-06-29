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



   
]