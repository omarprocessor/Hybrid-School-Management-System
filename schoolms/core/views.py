from rest_framework import generics, status
from rest_framework.response import Response
from .models import (ClassRoom, Exam, Mark, TeacherSubjectClass, Teacher, Student, Subject, Attendance, UserProfile, BlogPost)
from .serializers import AttendanceSerializer, RegistrationSerializer, UserProfileApprovalSerializer, MeSerializer

from .serializers import (ClassRoomSerializer, 
                          SubjectSerializer, StudentSerializer, 
                          TeacherSerializer, TeacherSubjectClassSerializer, 
                          ExamSerializer, MarkSerializer, UserSerializer, BlogPostSerializer)    

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import mixins
from django.contrib.auth.models import User
from rest_framework.views import APIView


# Classroom views
# This view handles both listing all classrooms and creating a new classroom.
class ClassRoomListCreateView(generics.ListCreateAPIView):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer

# This view handles retrieving, updating, and deleting a specific classroom by its ID.
class ClassRoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer
    lookup_field = 'id'  # Use 'id' as the lookup field for retrieving specific classrooms


#subject views
class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

# Student
class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
# Teacher
class TeacherListCreateView(generics.ListCreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherSubjectClassListCreateView(generics.ListCreateAPIView):
    queryset = TeacherSubjectClass.objects.all()
    serializer_class = TeacherSubjectClassSerializer

class TeacherSubjectClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeacherSubjectClass.objects.all()
    serializer_class = TeacherSubjectClassSerializer

# Exam
class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer\
    
class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

# Mark
class MarkListCreateView(generics.ListCreateAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer

class MarkDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer

# Attendance

class AttendanceCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date', '-time_in')
        classroom = self.request.query_params.get('classroom')
        date = self.request.query_params.get('date')
        if classroom:
            queryset = queryset.filter(classroom__id=classroom)
        if date:
            queryset = queryset.filter(date=date)
        return queryset

class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Registration successful! Please wait for admin approval.'}, status=status.HTTP_201_CREATED)

class UserApprovalListUpdateView(mixins.ListModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
    queryset = UserProfile.objects.filter(is_approved=False)
    serializer_class = UserProfileApprovalSerializer
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = MeSerializer(request.user)
        return Response(serializer.data)

class MyStudentView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({'detail': 'No student record found for this user.'}, status=404)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

class MyStudentMarksView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({'detail': 'No student record found for this user.'}, status=404)
        marks = Mark.objects.filter(student=student)
        serializer = MarkSerializer(marks, many=True)
        return Response(serializer.data)

class MyStudentAttendanceView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({'detail': 'No student record found for this user.'}, status=404)
        attendance = Attendance.objects.filter(student=student).order_by('-date', '-time_in')
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

class MyClassAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            classroom = ClassRoom.objects.get(class_teacher=teacher)
        except (Teacher.DoesNotExist, ClassRoom.DoesNotExist):
            return Response({'detail': 'No class assigned as class teacher.'}, status=404)
        attendance = Attendance.objects.filter(classroom=classroom).order_by('-date', '-time_in')
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class BlogPostListCreateView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer

class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'