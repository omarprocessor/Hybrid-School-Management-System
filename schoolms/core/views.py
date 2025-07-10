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
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework import mixins
from django.contrib.auth.models import User
from rest_framework.views import APIView
import csv
from django.http import StreamingHttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated


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
    parser_classes = [MultiPartParser, FormParser]

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser, FormParser]
    
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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

class MarksTemplateDownloadView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        exam_id = request.query_params.get('exam')
        class_id = request.query_params.get('classroom')
        if not exam_id or not class_id:
            return Response({'detail': 'exam and classroom are required.'}, status=400)
        try:
            exam = Exam.objects.get(id=exam_id)
            classroom = ClassRoom.objects.get(id=class_id)
        except (Exam.DoesNotExist, ClassRoom.DoesNotExist):
            return Response({'detail': 'Invalid exam or classroom.'}, status=404)
        students = Student.objects.filter(classroom=classroom)
        subjects = Subject.objects.all()
        header = ['admission_no', 'name'] + [s.name for s in subjects] + ['total', 'average', 'grade']
        def row_gen():
            yield header
            for student in students:
                row = [student.admission_no, student.full_name] + ['' for _ in subjects] + ['', '', '']
                yield row
        pseudo_buffer = (','.join(map(str, row)) + '\n' for row in row_gen())
        response = StreamingHttpResponse(pseudo_buffer, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="marks_template_{exam.name}_{classroom.name}.csv"'
        return response

class MarksCSVUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        exam_id = request.data.get('exam')
        class_id = request.data.get('classroom')
        file = request.FILES.get('file')
        if not exam_id or not class_id or not file:
            return Response({'detail': 'exam, classroom, and file are required.'}, status=400)
        try:
            exam = Exam.objects.get(id=exam_id)
            classroom = ClassRoom.objects.get(id=class_id)
        except (Exam.DoesNotExist, ClassRoom.DoesNotExist):
            return Response({'detail': 'Invalid exam or classroom.'}, status=404)
        subjects = list(Subject.objects.all())
        students = {s.admission_no: s for s in Student.objects.filter(classroom=classroom)}
        import csv
        reader = csv.DictReader((line.decode('utf-8') for line in file), skipinitialspace=True)
        created, updated, errors = 0, 0, []
        for row in reader:
            adm = row.get('admission_no')
            student = students.get(adm)
            if not student:
                errors.append(f"Student with admission_no {adm} not found.")
                continue
            total = 0
            count = 0
            for subj in subjects:
                mark_str = row.get(subj.name)
                if mark_str is None or mark_str.strip() == '':
                    continue
                try:
                    exam_score = int(mark_str)
                except ValueError:
                    errors.append(f"Invalid score for {subj.name} for {adm}.")
                    continue
                mark, created_obj = Mark.objects.update_or_create(
                    exam=exam, student=student, subject=subj,
                    defaults={'exam_score': exam_score, 'teacher': getattr(request.user, 'teacher', None)}
                )
                if created_obj:
                    created += 1
                else:
                    updated += 1
                total += exam_score
                count += 1
            # Calculate average
            average = total / count if count > 0 else 0
            # Use grade from CSV if provided, else calculate
            grade = row.get('grade')
            if not grade or grade.strip() == '':
                if average >= 80:
                    grade = 'A'
                elif average >= 70:
                    grade = 'B+'
                elif average >= 60:
                    grade = 'B'
                elif average >= 50:
                    grade = 'C'
                elif average >= 40:
                    grade = 'D'
                else:
                    grade = 'E'
            # Optionally, you could store the average/grade somewhere or return them in the response
        return Response({'created': created, 'updated': updated, 'errors': errors})