from django.urls import path
from . import views

# This is our URL configuration
# The 'urlpatterns' list is a list of paths that the Django server will respond to
# This configuration should be imported into the main urls configuration in the api folder
# Routes should always end with a forward slash
urlpatterns = [
    path('csrf-token/', views.get_csrf_token),
    path('query/', views.query_chatbot),
]
