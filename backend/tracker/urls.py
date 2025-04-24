from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # type: ignore
from . import views
from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import WorkoutDeleteView, WorkoutUpdateView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # FBV
    path('workouts/', views.workout_list_create, name='workout-list-create'),
    path('workouts/<int:pk>/', WorkoutDeleteView.as_view(), name='workout-delete'),
    path('workouts/<int:pk>/', WorkoutUpdateView.as_view(), name='workout-update'),
    path('notes/', views.note_list_create, name='note-list-create'),

    # CBV
    path('exercises/', views.ExerciseListCreateView.as_view(), name='exercise-list-create'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
]
