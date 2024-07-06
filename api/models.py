from typing import Any
from django.db import models
import uuid
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin



class CustomUserManager(BaseUserManager):


    def create_user(self, email, password, **extra_fields):
        if not email :
            raise ValueError("Email is needed")
        user_email = self.normalize_email(email)
        user = self.model(email = email , **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self,email,password , **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True :
            raise ValueError('superuser must be set to true')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('User Must be a staff')
        if extra_fields.get('is_admin') is not True:
            raise ValueError('User Must be an Admin')
        
        return self.create_user(email, password , **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    userId = models.UUIDField(default=uuid.uuid4, editable=False, unique = True, primary_key=True)
    firstName = models.CharField(max_length=450)
    lastName = models.CharField(max_length=450)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=350, blank = True, null = True)
    organizations = models.ManyToManyField('Organization')
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        return str(self.email)
    
    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['firstName', 'lastName']

    objects = CustomUserManager()


class Organization(models.Model):
    orgId = models.UUIDField(default=uuid.uuid4 , editable=False, unique=True, primary_key=True)
    name = models.CharField(max_length=450)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.name)
    













