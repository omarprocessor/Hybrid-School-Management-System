from rest_framework import generics
from .models import (ClassRoom, Exam, Mark, TeacherSubjectClass, Teacher, Student, Subject, Attendance)
from .serializers import AttendanceSerializer

from .serializers import (ClassRoomSerializer, 
                          SubjectSerializer, StudentSerializer, 
                          TeacherSerializer, TeacherSubjectClassSerializer, 
                          ExamSerializer, MarkSerializer)    


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
    queryset = Attendance.objects.all().order_by('-date', '-time_in')
    serializer_class = AttendanceSerializer