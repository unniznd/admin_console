from django.db import models
from django.contrib.auth.models import User as DjangoUser

class Roles(models.Model):
    role = models.CharField(max_length=100)

class Users(models.Model):
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    role = models.ForeignKey(Roles, on_delete=models.DO_NOTHING)

class Logs(models.Model):
    user = models.ForeignKey(DjangoUser, on_delete=models.DO_NOTHING)
    action = models.CharField(max_length=512)
    date = models.DateTimeField(auto_now_add=True)