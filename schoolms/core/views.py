from rest_framework import generics
from .models import ClassRoom

from .serializers import ClassRoomSerializer, SubjectSerializer, StudentSerializer
from .models import Student
from .models import Subject


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