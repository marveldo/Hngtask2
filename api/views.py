from django.shortcuts import render
from rest_framework import generics
from rest_framework.request import Request
from .models import *
from . serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework import renderers


# Create your views here.


class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = Userserializer
    renderer_classes = [renderers.JSONRenderer]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            try: 
               self.perform_create(serializer=serializer)
               user = serializer.instance
               access_token = AccessToken.for_user(user)
               res = {
                   "status": "success",
                   "message": "Registeration Succesful",
                   "data": {
                       'accessToken': str(access_token),
                       "user": serializer.data
                   }
               }
               return Response(res, status=status.HTTP_201_CREATED)
            except:
                res = {
                        "status": "Bad request",
                        "message": "Registration unsuccessful",
                        "statusCode": 400
                }
                return Response(res, status=status.HTTP_400_BAD_REQUEST)
        else :
            errors = []
            for field,error_list in serializer.errors.items():
                for error in error_list :
                    errors.append({"field": field , "message": str(error)})
            return Response({"errors": errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
    
class UserLogin(generics.GenericAPIView):
    serializer_class = LoginSerializer
    renderer_classes = [renderers.JSONRenderer]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            res = {
                "status": "success",
                "message": "Login Successful",
                "data": serializer.validated_data
            }
            return Response(res, status=status.HTTP_200_OK)
        else :
            errors = []
            for field,error_list in serializer.errors.items():
                for error in error_list :
                    errors.append({"field": field , "message": str(error)})
            return Response({"errors": errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
class GetUser(generics.RetrieveAPIView):
    serializer_class = Userserializer
    lookup_field = 'pk'
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [renderers.JSONRenderer]
    

    def get_queryset(self):
        organizations = self.request.user.organizations.all()
        organization_users = User.objects.filter(organizations__in = organizations).distinct()
        return organization_users

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, many = False)
        res = {
            "status":"success",
            "message":"Retrieval Successful",
            "data": serializer.data
        }
        return Response(res , status=status.HTTP_200_OK )

class Getorganizations(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin ):
    
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
    serializer_class = OrganizationSerializer
    renderer_classes = [renderers.JSONRenderer]

    def get_queryset(self):
        queryset = self.request.user.organizations.all()
        return queryset 
    
    def get_serializer_class(self):
        serializer_class =  super().get_serializer_class()
        if self.action == 'users':
            serializer_class = AddorganizationSerializer
            return serializer_class
        return serializer_class
    
    
    def list(self, request, *args, **kwargs):
        organizations = self.get_queryset()
        serializer = self.get_serializer(organizations, many = True)
        res = {
            "status": "success",
            "message":"QuerySuccessful",
            "data" : {
                "organisations": serializer.data
            }
        }
        return Response(res, status=status.HTTP_200_OK)
    
    def retrieve(self, request, *args, **kwargs):

        organization = self.get_object()
        serializer = self.get_serializer(organization, many = False)
        res= {
            "status":"success",
            "message": "QuerySuccesful",
            "data" : serializer.data
        }
        return Response(res, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data, context = {'request': request})
        if serializer.is_valid():
            try:
                self.perform_create(serializer=serializer)
                res = {
                    "status": "Successful",
                    "message": "Organisation created successfully",
                    "data": serializer.data
                }
                return Response(res, status = status.HTTP_201_CREATED)
            except :
                res = {
                       "status": "Bad Request",
                       "message": "Client error",
                          "statusCode": 400
                }
                return Response(res, status=status.HTTP_400_BAD_REQUEST)
        else :
            errors = []
            for field,error_list in serializer.errors.items():
                for error in error_list :
                    errors.append({"field": field , "message": str(error)})
            return Response({"errors": errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
    @action(detail=True , methods=['post'])
    def users(self ,request, pk = None):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['userId']
            try:
                user = User.objects.get(userId = user_id)
            except User.DoesNotExist:
                res = {
                       "status": "User Not found",
                       "message": "Client error",
                          "statusCode": 404
                  }
                return Response(res, status=status.HTTP_404_NOT_FOUND)
            organisation = self.get_object()
            user.organizations.add(organisation)
            user.save()
            res = {
                      "status": "success",
                      "message": "User added to organisation successfully",
                   }
            return Response(res, status=status.HTTP_200_OK)

        else : 
            errors = []
            for field,error_list in serializer.errors.items():
                for error in error_list :
                    errors.append({"field": field , "message": str(error)})
            return Response({"errors": errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        







    
    













