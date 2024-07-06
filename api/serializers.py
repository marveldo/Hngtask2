from typing import Any, Dict
from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from django.conf import settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import authenticate
from rest_framework import exceptions
from rest_framework_simplejwt.authentication import default_user_authentication_rule




    
class Userserializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["userId","firstName","lastName","email","phone","password"]
        extra_kwargs = {"password":{"write_only": True}}
  

    def create(self, validated_data):
        for fieldname,field in self.fields.items():
            if fieldname not in validated_data:
                validated_data[f'{fieldname}'] = None
        user = User(
            firstName = validated_data['firstName'],
            lastName = validated_data['lastName'],
            email = validated_data['email'],
            phone = validated_data['phone']
        )
        user.set_password(validated_data['password'])
       
        organisation = Organization.objects.create(name = f"{user.firstName}'s Organisation")
        
        user.save() 

        user.organizations.add(organisation)
        user.save()
       
        return user
    

class LoginSerializer(TokenObtainSerializer):
    token_class = AccessToken
    default_error_messages = {
        "no_active_account" : {
    "status": "Bad request",
    "message": "Authentication failed",
    "statusCode": 401
}
    }
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        if not default_user_authentication_rule(self.user):
            raise exceptions.AuthenticationFailed(self.error_messages["no_active_account"], "no_active_account")
        
        access = self.get_token(self.user)
        

        data = {
            "accessToken" : str(access),
            "user": Userserializer(self.user, many = False).data
        }

        if settings.SIMPLE_JWT["UPDATE_LAST_LOGIN"]:
            update_last_login(None, self.user)

        return data
    
class OrganizationSerializer(serializers.ModelSerializer):

    class Meta :
        model = Organization
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get('request')
        for fieldname,field in self.fields.items():
            if fieldname not in validated_data :
                validated_data[f'{fieldname}'] = None
        
        organisation = Organization.objects.create(**validated_data)
        organisation.save()
        request.user.organizations.add(organisation)
        request.user.save()
        return organisation

class AddorganizationSerializer(serializers.Serializer):
    userId = serializers.CharField(max_length = 400, required = True)

    

   




    


     
   
         
    
    

        