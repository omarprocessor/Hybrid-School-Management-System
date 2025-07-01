from rest_framework import serializers
from datetime import date
from django.utils import timezone
from django.contrib.auth.models import User
from .models import ClassRoom, Subject, Student, Teacher, TeacherSubjectClass, Exam, Mark, Attendance
import africastalking
from django.conf import settings

# Initialize Africa's Talking only once
africastalking.initialize(
    username=settings.AFRICASTALKING_USERNAME,
    api_key=settings.AFRICASTALKING_API_KEY
)
sms = africastalking.SMS


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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TeacherSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Teacher
        fields = '__all__'

class TeacherSubjectClassSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    classroom = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all())

    class Meta:
        model = TeacherSubjectClass
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'

class MarkSerializer(serializers.ModelSerializer):
    exam = serializers.PrimaryKeyRelatedField(queryset=Exam.objects.all())


    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    teacher = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all())

    class Meta:
        model = Mark
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    admission_no = serializers.CharField(write_only=True)
    student = serializers.StringRelatedField(read_only=True)
    classroom = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Attendance
        fields = ['admission_no', 'student', 'classroom', 'date', 'time_in', 'time_out']
        read_only_fields = ['student', 'classroom', 'date', 'time_in', 'time_out']

    def create(self, validated_data):
        admission_no = validated_data.pop('admission_no')

        try:
            student = Student.objects.get(admission_no=admission_no)
        except Student.DoesNotExist:
            raise serializers.ValidationError({'admission_no': 'Student not found'})

        today = date.today()
        attendance = Attendance.objects.filter(student=student, date=today).order_by('-time_in').first()

        if attendance:
            if not attendance.time_out:
                attendance.time_out = timezone.localtime(timezone.now()).time()
                attendance.save()
                self.send_sms(student, is_time_out=True)
                return attendance
            else:
                raise serializers.ValidationError({'detail': 'Attendance already completed today'})

        # First check-in
        attendance = Attendance.objects.create(
            student=student,
            classroom=student.classroom,
            time_in=timezone.localtime(timezone.now()).time()
        )
        self.send_sms(student, is_time_out=False)
        return attendance

    def send_sms(self, student, is_time_out=False):
        now = timezone.localtime(timezone.now())
        date_str = now.strftime('%b %d, %Y')
        time_str = now.strftime('%I:%M %p')

        if not student.parent_phone:
            return  # Skip if no parent number

        message = (
            f"Dear Parent, {student.full_name} has "
            f"{'left the school' if is_time_out else 'arrived at the school'} "
            f"on {date_str} at {time_str}."
        )

        try:
            response = sms.send(message, [student.parent_phone])
            print("📨 Africa's Talking response:")
            print(response)
        except Exception as e:
            print(f"SMS failed: {e}")