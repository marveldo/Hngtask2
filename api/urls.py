from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter,APIRootView


class CustomApiRootView(APIRootView):
    renderer_classes = [renderers.JSONRenderer]

class CustomRouter(DefaultRouter):
    APIRootView = CustomApiRootView
    
router = CustomRouter(trailing_slash=False)
router.register('api/organisations', Getorganizations , 'organisation')

urlpatterns = [
    path('auth/register', CreateUser.as_view()),
    path('auth/login',UserLogin.as_view() ),
    path('api/users/<str:pk>', GetUser.as_view()),

] + router.urls