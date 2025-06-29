from rest_framework import generics
from .models import ClassRoom

from .serializers import ClassRoomSerializer

# Classroom views
# This view handles both listing all classrooms and creating a new classroom.
class ClassRoomListCreateView(generics.ListCreateAPIView):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer
