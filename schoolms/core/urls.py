from django.urls import path
from . import views

urlpatterns = [
    # ClassRoom
    path('classrooms/', views.ClassRoomListCreateView.as_view(), name='classroom-list'),
    path('classrooms/<int:id>/', views.ClassRoomDetailView.as_view(), name='classroom-detail'),
   
]