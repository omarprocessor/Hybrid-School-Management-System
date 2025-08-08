# School Information Management

## Overview
The SchoolInfo model has been added to the Hybrid School Management System to centralize and manage school information across the application.

## Features

### Backend (Django)
- **Model**: `SchoolInfo` - Stores school information including name, contact details, location, and logo
- **API Endpoint**: `/api/school-info/` - GET and PATCH operations
- **Admin Interface**: Full CRUD operations through Django admin
- **File Upload**: Support for school logo upload

### Frontend (React)
- **Dynamic Display**: School information is fetched and displayed dynamically in:
  - Header (school name)
  - Footer (all contact information)
  - Contact page (address, email, phone)
- **Admin Dashboard**: New "School Info" section for managing school information

## Database Schema

```python
class SchoolInfo(models.Model):
    school_name = models.CharField(max_length=200, default="SCHOOL MANAGEMENT SYSTEM")
    po_box = models.CharField(max_length=50, default="P.O. Box: 12345 - 00100")
    phone = models.CharField(max_length=50, default="TEL: 020-1234567 / 0720-123456")
    location = models.CharField(max_length=100, default="NAIROBI")
    email = models.EmailField(default="info@schoolms.com")
    logo = models.ImageField(upload_to='school_logos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## API Usage

### Get School Information
```bash
GET /api/school-info/
```

### Update School Information
```bash
PATCH /api/school-info/
Content-Type: multipart/form-data

{
    "school_name": "Updated School Name",
    "po_box": "P.O. Box: 54321 - 00100",
    "phone": "TEL: 020-9876543 / 0720-987654",
    "location": "MOMBASA",
    "email": "info@updatedschool.com",
    "logo": [file upload]
}
```

## Frontend Components

### AdminSchoolInfo Component
- Located at: `front-end/src/components/Dashboard/AdminSchoolInfo.js`
- Features:
  - Form for editing all school information
  - File upload for school logo
  - Real-time validation
  - Success/error messaging
  - Loading states

### Updated Components
- **Header.js**: Displays dynamic school name
- **Footer.js**: Shows all contact information from API
- **Contact.js**: Uses school information for contact details

## How to Use

### 1. Access Admin Dashboard
1. Login as an admin user
2. Navigate to the admin dashboard
3. Click on "School Info" in the sidebar

### 2. Update School Information
1. Fill in the form fields with updated information
2. Optionally upload a new school logo
3. Click "Update School Information"
4. Changes will be reflected immediately across the application

### 3. View Changes
- The school name will update in the header
- Contact information will update in the footer
- Contact page will show updated details
- Logo will be displayed where applicable

## File Structure

```
schoolms/
├── core/
│   ├── models.py (SchoolInfo model)
│   ├── serializers.py (SchoolInfoSerializer)
│   ├── views.py (SchoolInfoView)
│   ├── urls.py (school-info endpoint)
│   └── admin.py (SchoolInfoAdmin)
└── front-end/src/components/
    ├── Dashboard/
    │   └── AdminSchoolInfo.js (Admin interface)
    ├── Header.js (Updated)
    ├── Footer.js (Updated)
    └── Contact.js (Updated)
```

## Security
- School information is publicly readable (no authentication required for GET)
- Only admin users can update school information (authentication required for PATCH)
- File uploads are restricted to image files only

## Default Values
When the system is first set up, default values are provided:
- School Name: "SCHOOL MANAGEMENT SYSTEM"
- P.O. Box: "P.O. Box: 12345 - 00100"
- Phone: "TEL: 020-1234567 / 0720-123456"
- Location: "NAIROBI"
- Email: "info@schoolms.com"

## Migration
The model has been migrated and is ready to use. The first record is automatically created when the API is first accessed. 