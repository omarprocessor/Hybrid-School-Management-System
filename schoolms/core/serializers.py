from rest_framework import serializers
from datetime import date
from django.utils import timezone
from django.contrib.auth.models import User
from .models import ClassRoom, Subject, Student, Teacher, TeacherSubjectClass, Exam, Mark, Attendance, UserProfile, BlogPost
import africastalking
from django.conf import settings

# Initialize Africa's Talking only once
africastalking.initialize(
    username=settings.AFRICASTALKING_USERNAME,
    api_key=settings.AFRICASTALKING_API_KEY
)
sms = africastalking.SMS

class TeacherSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Teacher
        fields = '__all__'

class ClassRoomSerializer(serializers.ModelSerializer):
    class_teacher = TeacherSerializer(read_only=True)
    class_teacher_id = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all(), source='class_teacher', write_only=True, required=False)

    class Meta:
        model = ClassRoom
        fields = '__all__'
        extra_fields = ['class_teacher_id']

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
        fields = ['id', 'admission_no', 'student', 'classroom', 'date', 'time_in', 'time_out']
        read_only_fields = ['id', 'student', 'classroom', 'date', 'time_in', 'time_out']

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

class RegistrationSerializer(serializers.ModelSerializer):
    requested_role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES)
    password = serializers.CharField(write_only=True)
    # Add student fields
    full_name = serializers.CharField(required=False)
    admission_no = serializers.CharField(required=False)
    gender = serializers.CharField(required=False)
    classroom = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all(), required=False)
    parent_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'requested_role', 'full_name', 'admission_no', 'gender', 'classroom', 'parent_phone']

    def create(self, validated_data):
        requested_role = validated_data.pop('requested_role', None)
        gender = validated_data.pop('gender', None)
        # Remove student creation logic here
        # Previously, a Student record was created here if requested_role == 'student'.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user, requested_role=requested_role)
        return user

class UserProfileApprovalSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    student_id = serializers.IntegerField(write_only=True, required=False)
    teacher_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'requested_role', 'is_approved', 'role', 'student_id', 'teacher_id']

    def update(self, instance, validated_data):
        student_id = validated_data.pop('student_id', None)
        teacher_id = validated_data.pop('teacher_id', None)
        role = validated_data.get('role')
        user = instance.user
        # Map user to student or teacher
        if role == 'student' and student_id:
            from .models import Student
            student = Student.objects.get(id=student_id)
            student.user = user
            student.save()
        if role == 'teacher' and teacher_id:
            from .models import Teacher
            teacher = Teacher.objects.get(id=teacher_id)
            teacher.user = user
            teacher.save()
        return super().update(instance, validated_data)

class MeSerializer(serializers.ModelSerializer):
    is_approved = serializers.SerializerMethodField()
    is_superuser = serializers.BooleanField(read_only=True)
    role = serializers.CharField(source='userprofile.role', read_only=True)
    requested_role = serializers.CharField(source='userprofile.requested_role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_approved', 'is_superuser', 'role', 'requested_role']

    def get_is_approved(self, obj):
        if obj.is_superuser:
            return True
        return obj.userprofile.is_approved

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'