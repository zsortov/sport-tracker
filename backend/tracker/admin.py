from django.contrib import admin
from .models import Category, Exercise, Workout, Note


admin.site.register(Category)
admin.site.register(Exercise)
admin.site.register(Workout)
admin.site.register(Note)

