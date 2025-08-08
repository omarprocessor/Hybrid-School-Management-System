from rest_framework import generics, status
from rest_framework.response import Response
from .models import (ClassRoom, Exam, Mark, TeacherSubjectClass, Teacher, Student, Subject, Attendance, UserProfile, BlogPost, SchoolInfo)
from .serializers import AttendanceSerializer, RegistrationSerializer, UserProfileApprovalSerializer, MeSerializer

from .serializers import (ClassRoomSerializer, 
                          SubjectSerializer, StudentSerializer, 
                          TeacherSerializer, TeacherSubjectClassSerializer, 
                          ExamSerializer, MarkSerializer, UserSerializer, BlogPostSerializer, SchoolInfoSerializer)    

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
from django.db.models import Count, Avg, Q
from datetime import datetime, timedelta


# Debug endpoint to test school logo URL
class SchoolLogoTestView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            school_info, created = SchoolInfo.objects.get_or_create(pk=1)
            
            if school_info.logo and hasattr(school_info.logo, 'url'):
                # Get the current request's scheme and host
                scheme = request.scheme
                host = request.get_host()
                # Construct the full URL
                school_logo_url = f"{scheme}://{host}{school_info.logo.url}"
                
                return Response({
                    'school_name': school_info.school_name,
                    'logo_url': school_logo_url,
                    'logo_path': str(school_info.logo),
                    'request_scheme': scheme,
                    'request_host': host,
                    'full_url': school_logo_url
                })
            else:
                return Response({
                    'error': 'No logo found',
                    'school_name': school_info.school_name
                })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)

# SchoolInfo views
class SchoolInfoView(generics.RetrieveUpdateAPIView):
    queryset = SchoolInfo.objects.all()
    serializer_class = SchoolInfoSerializer
    permission_classes = [AllowAny]  # Allow public access to school info
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        # Get the first (and only) school info record, or create one if it doesn't exist
        obj, created = SchoolInfo.objects.get_or_create(pk=1)
        return obj

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
    serializer_class = ExamSerializer
    
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
        
        # Check if teacher has permission for this class
        try:
            teacher = Teacher.objects.get(user=request.user)
            teacher_assignments = TeacherSubjectClass.objects.filter(
                teacher=teacher, 
                classroom=classroom
            )
            if not teacher_assignments.exists():
                return Response({'detail': 'You do not have permission to download template for this class.'}, status=403)
        except Teacher.DoesNotExist:
            return Response({'detail': 'Teacher profile not found.'}, status=404)
        
        students = Student.objects.filter(classroom=classroom).order_by('full_name')
        subjects = Subject.objects.all().order_by('name')
        
        if not students.exists():
            return Response({'detail': 'No students found in this class.'}, status=400)
        
        # Create CSV content
        import csv
        import io
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header row
        header = ['admission_no', 'name'] + [s.name for s in subjects] + ['total', 'average', 'grade']
        writer.writerow(header)
        
        # Write student rows with example data
        for student in students:
            row = [
                student.admission_no,
                student.full_name
            ]
            
            # Add empty cells for subjects (to be filled by teacher)
            for _ in subjects:
                row.append('')
            
            # Add empty cells for calculated fields
            row.extend(['', '', ''])
            
            writer.writerow(row)
        
        # Get the CSV content
        csv_content = output.getvalue()
        output.close()
        
        # Create response
        response = StreamingHttpResponse(
            iter([csv_content]), 
            content_type='text/csv; charset=utf-8'
        )
        response['Content-Disposition'] = f'attachment; filename="marks_template_{exam.name}_{classroom.name}.csv"'
        response['Content-Length'] = len(csv_content.encode('utf-8'))
        
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
        
        # Check if teacher has permission for this class
        try:
            teacher = Teacher.objects.get(user=request.user)
            teacher_assignments = TeacherSubjectClass.objects.filter(
                teacher=teacher, 
                classroom=classroom
            )
            if not teacher_assignments.exists():
                return Response({'detail': 'You do not have permission to upload marks for this class.'}, status=403)
        except Teacher.DoesNotExist:
            return Response({'detail': 'Teacher profile not found.'}, status=404)
        
        subjects = list(Subject.objects.all())
        students = {s.admission_no: s for s in Student.objects.filter(classroom=classroom)}
        
        if not students:
            return Response({'detail': 'No students found in this class.'}, status=400)
        
        created, updated, errors = 0, 0, []
        
        try:
            import csv
            import io
            
            # Read file content
            file_content = file.read()
            
            # Try different encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
            decoded_content = None
            
            for encoding in encodings:
                try:
                    decoded_content = file_content.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue
            
            if decoded_content is None:
                return Response({'detail': 'Unable to decode CSV file. Please ensure it is saved as UTF-8.'}, status=400)
            
            # Create StringIO object for CSV reader
            csv_file = io.StringIO(decoded_content)
            reader = csv.DictReader(csv_file, skipinitialspace=True)
            
            # Validate CSV headers
            required_headers = ['admission_no', 'name']
            optional_headers = [s.name for s in subjects] + ['total', 'average', 'grade']
            all_headers = required_headers + optional_headers
            
            if not reader.fieldnames:
                return Response({'detail': 'CSV file appears to be empty or invalid.'}, status=400)
            
            missing_headers = [h for h in required_headers if h not in reader.fieldnames]
            if missing_headers:
                return Response({
                    'detail': f'Missing required headers: {", ".join(missing_headers)}. Please download the template first.'
                }, status=400)
            
            # Process each row
            for row_num, row in enumerate(reader, start=2):  # Start from 2 because row 1 is header
                adm = row.get('admission_no', '').strip()
                if not adm:
                    errors.append(f"Row {row_num}: Missing admission number")
                    continue
                
                student = students.get(adm)
                if not student:
                    errors.append(f"Row {row_num}: Student with admission_no '{adm}' not found in class")
                    continue
                
                total = 0
                count = 0
                subject_marks = {}
                
                # Process marks for each subject
                for subj in subjects:
                    mark_str = row.get(subj.name, '').strip()
                    if not mark_str:
                        continue
                    
                    try:
                        exam_score = int(mark_str)
                        if exam_score < 0 or exam_score > 100:
                            errors.append(f"Row {row_num}: Invalid score {exam_score} for {subj.name} (must be 0-100)")
                            continue
                        
                        subject_marks[subj] = exam_score
                        total += exam_score
                        count += 1
                    except ValueError:
                        errors.append(f"Row {row_num}: Invalid score '{mark_str}' for {subj.name} (must be a number)")
                        continue
                
                # Create or update marks
                for subj, score in subject_marks.items():
                    try:
                        mark, created_obj = Mark.objects.update_or_create(
                            exam=exam, 
                            student=student, 
                            subject=subj,
                            defaults={
                                'exam_score': score, 
                                'teacher': teacher
                            }
                        )
                        if created_obj:
                            created += 1
                        else:
                            updated += 1
                    except Exception as e:
                        errors.append(f"Row {row_num}: Error saving mark for {subj.name}: {str(e)}")
            
            # Clear any previous errors if we have successful uploads
            if created > 0 or updated > 0:
                errors = [e for e in errors if "Row" not in e]  # Keep only non-row specific errors
            
            return Response({
                'created': created, 
                'updated': updated, 
                'errors': errors,
                'message': f'Successfully processed {created + updated} marks'
            })
            
        except Exception as e:
            return Response({
                'detail': f'Error processing CSV file: {str(e)}',
                'errors': [f'File processing error: {str(e)}']
            }, status=500)

class StudentResultPDFView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
        except Student.DoesNotExist:
            return Response({'detail': 'No student record found for this user.'}, status=404)
        
        # Get exam_id from query parameters
        exam_id = request.query_params.get('exam_id')
        
        try:
            # Get school information
            school_info, created = SchoolInfo.objects.get_or_create(pk=1)
            
            # Get all marks for the student
            marks = Mark.objects.filter(student=student).select_related('exam', 'subject')
            
            if exam_id:
                # Filter for specific exam
                try:
                    exam = Exam.objects.get(id=exam_id)
                    marks = marks.filter(exam=exam)
                    exams = [exam]
                    subjects = Subject.objects.filter(mark__student=student, mark__exam=exam).distinct()
                except Exam.DoesNotExist:
                    return Response({'detail': 'Exam not found.'}, status=404)
            else:
                # Get all exams and subjects
                exams = Exam.objects.filter(mark__student=student).distinct()
                subjects = Subject.objects.filter(mark__student=student).distinct()
            
            # Group marks by exam
            exam_marks = {}
            for exam in exams:
                exam_marks[exam.id] = {
                    'exam': {
                        'id': exam.id,
                        'name': exam.name,
                        'term': exam.term,
                        'year': exam.year,
                        'start_date': exam.start_date.strftime('%Y-%m-%d')
                    },
                    'marks': {},
                    'total': 0,
                    'average': 0,
                    'grade': 'E'
                }
            
            # Populate marks for each exam
            for mark in marks:
                exam_id = mark.exam.id
                subject_id = mark.subject.id
                if exam_id not in exam_marks:
                    continue
                exam_marks[exam_id]['marks'][subject_id] = mark.exam_score
                exam_marks[exam_id]['total'] += mark.exam_score
            
            # Calculate averages and grades
            for exam_data in exam_marks.values():
                subject_count = len(exam_data['marks'])
                if subject_count > 0:
                    exam_data['average'] = exam_data['total'] / subject_count
                    average = exam_data['average']
                    if average >= 80:
                        exam_data['grade'] = 'A'
                    elif average >= 70:
                        exam_data['grade'] = 'B+'
                    elif average >= 60:
                        exam_data['grade'] = 'B'
                    elif average >= 50:
                        exam_data['grade'] = 'C'
                    elif average >= 40:
                        exam_data['grade'] = 'D'
                    else:
                        exam_data['grade'] = 'E'
            
            # Handle profile picture URL safely
            profile_pic_url = None
            if student.profile_pic and hasattr(student.profile_pic, 'url'):
                try:
                    profile_pic_url = request.build_absolute_uri(student.profile_pic.url)
                except Exception as e:
                    print(f"Error building profile pic URL: {e}")
                    profile_pic_url = None
            
            # Handle school logo URL safely
            school_logo_url = None
            if school_info.logo and hasattr(school_info.logo, 'url'):
                try:
                    # Get the current request's scheme and host
                    scheme = request.scheme
                    host = request.get_host()
                    # Construct the full URL
                    school_logo_url = f"{scheme}://{host}{school_info.logo.url}"
                    print(f"Constructed logo URL: {school_logo_url}")
                except Exception as e:
                    print(f"Error building school logo URL: {e}")
                    school_logo_url = None
            
            # Prepare data for PDF
            pdf_data = {
                'school_info': {
                    'school_name': school_info.school_name,
                    'po_box': school_info.po_box,
                    'phone': school_info.phone,
                    'location': school_info.location,
                    'email': school_info.email,
                    'logo_url': school_logo_url
                },
                'student': {
                    'name': student.full_name,
                    'admission_no': student.admission_no,
                    'classroom': student.classroom.name,
                    'gender': student.gender,
                    'profile_pic_url': profile_pic_url
                },
                'subjects': [{'id': s.id, 'name': s.name, 'code': s.code} for s in subjects],
                'exams': [{'id': e.id, 'name': e.name, 'term': e.term, 'year': e.year, 'start_date': e.start_date.strftime('%Y-%m-%d')} for e in exams],
                'exam_marks': exam_marks
            }
            
            print(f"PDF data school_info: {pdf_data['school_info']}")
            
            return Response(pdf_data)
            
        except Exception as e:
            print(f"Error in StudentResultPDFView: {e}")
            return Response({'detail': f'Internal server error: {str(e)}'}, status=500)


# Stats API endpoint for dashboard statistics
class StatsView(APIView):
    permission_classes = [AllowAny]  # Allow public access to stats
    
    def get(self, request):
        try:
            # Get counts from database
            total_students = Student.objects.count()
            total_teachers = Teacher.objects.count()
            total_classes = ClassRoom.objects.count()
            total_subjects = Subject.objects.count()
            
            # Calculate attendance rate (last 30 days)
            thirty_days_ago = datetime.now().date() - timedelta(days=30)
            recent_attendance = Attendance.objects.filter(date__gte=thirty_days_ago).count()
            total_expected_attendance = total_students * 30  # Assuming 30 school days
            attendance_rate = round((recent_attendance / total_expected_attendance) * 100, 1) if total_expected_attendance > 0 else 0
            
            # Calculate average exam performance
            recent_marks = Mark.objects.filter(
                exam__start_date__gte=thirty_days_ago
            ).aggregate(avg_score=Avg('exam_score'))
            avg_performance = round(recent_marks['avg_score'] or 0, 1)
            
            # Get recent exam count
            recent_exams = Exam.objects.filter(start_date__gte=thirty_days_ago).count()
            
            # Calculate success rate based on passing grades (50% and above)
            passing_marks = Mark.objects.filter(exam_score__gte=50).count()
            total_marks = Mark.objects.count()
            success_rate = round((passing_marks / total_marks) * 100, 1) if total_marks > 0 else 0
            
            stats = {
                'total_students': total_students,
                'total_teachers': total_teachers,
                'total_classes': total_classes,
                'total_subjects': total_subjects,
                'attendance_rate': attendance_rate,
                'avg_performance': avg_performance,
                'recent_exams': recent_exams,
                'success_rate': success_rate,
                'last_updated': datetime.now().isoformat()
            }
            
            return Response(stats)
            
        except Exception as e:
            print(f"Error in StatsView: {e}")
            return Response({
                'error': 'Failed to fetch statistics',
                'detail': str(e)
            }, status=500)