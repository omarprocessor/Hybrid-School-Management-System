from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ClassRoom, Subject, Student

class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    classroom = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all())


    class Meta:
        model = Student
        fields = '__all__'