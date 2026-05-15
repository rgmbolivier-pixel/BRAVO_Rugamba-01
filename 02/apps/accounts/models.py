from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLES = (
        ('admin', 'HQ Admin'),
        ('manager', 'Store Manager'),
        ('staff', 'Store Staff'),
    )
    
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    full_name_az = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLES, default='staff')
    phone = models.CharField(max_length=20, blank=True, null=True)
    branch = models.ForeignKey('inventory.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, default='active')
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
