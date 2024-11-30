from django.contrib.auth.models import User as DjangoUser

from rest_framework import serializers

from .models import Users, Roles, Logs

# User Serializers

class CreateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100, required=True)
    name = serializers.CharField(max_length=100, required=True)
    is_admin = serializers.BooleanField(required=True)
    is_active = serializers.BooleanField(required=True)
    role = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Users
        fields = ('username', 'name', 'is_admin', 'is_active', 'role')
    
    def validate_username(self, value):
        if DjangoUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value
    
    def validate_role(self, value):
        if not Roles.objects.filter(role=value).exists():
            raise serializers.ValidationError('Role does not exist')
        return value
    

class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'user', 'name', 'is_admin', 'is_active', 'role')
    
    def user(self, obj):
        return obj.user.username

    def role(self, obj):
        return obj.role.role

class UpdateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100, required=True)
    name = serializers.CharField(max_length=100, required=True)
    is_admin = serializers.BooleanField(required=True)
    is_active = serializers.BooleanField(required=True)
    role = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Users
        fields = ('name', 'is_admin', 'is_active', 'role')
    
    def validate_role(self, value):
        if not Roles.objects.filter(role=value).exists():
            raise serializers.ValidationError('Role does not exist')
        return value
    
    def validate_username(self, value):
        if not DjangoUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('User does not exist')
        return value


# Role Serializers

class CreateRoleSerializer(serializers.ModelSerializer):
    role = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Roles
        fields = ('role',)

    def validate_role(self, value):
        if Roles.objects.filter(role=value).exists():
            raise serializers.ValidationError('Role already exists')
        return value

class GetRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ('id', 'role')

class UpdateRoleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    role = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Roles
        fields = ('id', 'role',)

    def validate_role(self, value):
        if Roles.objects.filter(role=value).exists():
            raise serializers.ValidationError('Role name already exists')
        return value
    
    def validate_id(self, value):
        if not Roles.objects.filter(id=value).exists():
            raise serializers.ValidationError('Role does not exist')
        return value
    

# Log Serializers

class GetLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = ('id', 'user', 'action', 'date')
    
    def user(self, obj):
        return obj.user.username
    
    def date(self, obj):
        return obj.date.strftime("%B %d, %Y %I:%M %p")
    
