from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MyTokenObtainPairView

urlpatterns = [
    # JWT Auth
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
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
    path('marks/template/', views.MarksTemplateDownloadView.as_view(), name='marks-template-download'),
    path('marks/upload/', views.MarksCSVUploadView.as_view(), name='marks-csv-upload'),

     # Attendance
    path('attendance/', views.AttendanceCreateView.as_view(), name='attendance-create'),
    path('attendance/list/', views.AttendanceListView.as_view(), name='attendance-list'),
    path('attendance/<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance-detail'),
    path('register/', views.RegistrationView.as_view(), name='register'),
    path('user-approvals/', views.UserApprovalListUpdateView.as_view(), name='user-approvals'),
    path('user-approvals/<int:pk>/', views.UserApprovalListUpdateView.as_view(), name='user-approval-detail'),
    path('me/', views.MeView.as_view(), name='me'),
    path('my-student/', views.MyStudentView.as_view(), name='my-student'),
    path('my-marks/', views.MyStudentMarksView.as_view(), name='my-marks'),
    path('my-attendance/', views.MyStudentAttendanceView.as_view(), name='my-attendance'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('my-class-attendance/', views.MyClassAttendanceView.as_view(), name='my-class-attendance'),
    # Blog
    path('blog/', views.BlogPostListCreateView.as_view(), name='blog-list'),
    path('blog/<slug:slug>/', views.BlogPostDetailView.as_view(), name='blog-detail'),
]





   
