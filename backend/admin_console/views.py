from django.contrib.auth.models import User as DjangoUser
from django.db import transaction
from django.utils.crypto import get_random_string

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import Users, Roles, Logs
from .permissions import IsAdmin
from .serializers import (
   CreateUserSerializer, GetUserSerializer, UpdateUserSerializer,
   CreateRoleSerializer, GetRoleSerializer, UpdateRoleSerializer,
   GetLogSerializer,
)

class UserView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request, *args, **kwargs):
        """
        Handles the GET request to retrieve a list of all users.

        This method fetches all the user records from the `Users` model
        and serializes them using the `GetUserSerializer`. It returns
        the serialized data in the response.

        Args:
            request: The HTTP request object containing metadata and any query parameters.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).

        Returns:
            Response: A Response object containing the serialized list of users
                    with HTTP 200 status.
        """
        
        users = Users.objects.all()
        serializer = GetUserSerializer(users, many=True)
        return Response({
            'status': 'SUCCESS',
            'data': serializer.data
        })
    
    def post(self, request, *args, **kwargs):
        """
        Handles the POST request to create a new user.

        This method validates the input data using the `CreateUserSerializer`.
        If the data is valid, it creates a new user record in the `Users` model
        and returns a success response. If the data is invalid, it returns an
        error response with details of the validation errors.

        Args:
            request: The HTTP request object containing the user data to be created.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """
        
        
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'status':'INVALID_INPUT',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        
        password = get_random_string(length=8)

        with transaction.atomic():
            user = DjangoUser.objects.create_user(
                username=validated_data['username'],
                password=password
            )

            user = Users.objects.create(
                user=user,
                name=validated_data['name'],
                is_admin=validated_data['is_admin'],
                is_active=validated_data['is_active'],
                role=Roles.objects.get(id=validated_data['role'])
            )

            log = Logs.objects.create(
                user=request.user,
                action=f'User {user.name} created'
            )
        
        return Response({
            'status': 'USER_CREATED',
            'message': 'User created successfully',
            'data':{
                'username': validated_data['username'],
                'password': password
            }
        }, status=status.HTTP_201_CREATED)


        
    def put(self, request, *args, **kwargs):
        """
        Handles the PUT request to update an existing user.

        This method validates the input data using the `UpdateUserSerializer`.
        If the data is valid, it updates the user record in the `Users` model
        and returns a success response. If the data is invalid, it returns an
        error response with details of the validation errors.

        Args:
            request: The HTTP request object containing the user data to be updated.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).

        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """

        serializer = UpdateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'status':'INVALID_INPUT',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data

        user = Users.objects.get(user__username=validated_data['username'])
        user.name = validated_data['name']
        user.is_admin = validated_data['is_admin']
        user.is_active = validated_data['is_active']
        user.role = Roles.objects.get(id=validated_data['role'])
        user.save()

        log = Logs.objects.create(
            user=request.user,
            action=f'User {user.name} updated'
        )

        return Response({
            'status': 'USER_UPDATED',
            'message': 'User updated successfully',
        })


    
    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to delete an existing user.

        This method deletes the user record in the `Users` model
        and returns a success response. If the user does not exist,
        it returns an error response.

        Args:
            request: The HTTP request object containing the user data to be deleted.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """
        try:
            user = Users.objects.get(user=request.data['user'])
        except Users.DoesNotExist:
            return Response({
                'status': 'USER_NOT_FOUND',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user.delete()

        log = Logs.objects.create(
            user=request.user,
            action=f'User {user.name} deleted'
        )

        return Response({
            'status': 'USER_DELETED',
            'message': 'User deleted successfully',
        })

class RoleView(APIView):
    permission_classes = [
        IsAdmin,
    ]

    def get(self, request, *args, **kwargs):
        """
        Handles the GET request to retrieve a list of all roles.

        This method fetches all the role records from the `Roles` model
        and serializes them using the `GetRoleSerializer`. It returns
        the serialized data in the response.

        Args:
            request: The HTTP request object containing metadata and any query parameters.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the serialized list of roles
                    with HTTP 200 status.
        """
        roles = Roles.objects.all()
        serializer = GetRoleSerializer(roles, many=True)
        return Response({
            'status': 'SUCCESS',
            'data': serializer.data
        })
    
    def post(self, request, *args, **kwargs):
        """
        Handles the POST request to create a new role.

        This method validates the input data using the `CreateRoleSerializer`.
        If the data is valid, it creates a new role record in the `Roles` model
        and returns a success response. If the data is invalid, it returns an
        error response with details of the validation errors.

        Args:
            request: The HTTP request object containing the role data to be created.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """
        serializer = CreateRoleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'status':'INVALID_INPUT',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        role = Roles.objects.create(role=request.data['role'])

        log = Logs.objects.create(
            user=request.user,
            action=f'Role {role.role} created'
        )

        return Response({
            'status': 'ROLE_CREATED',
            'message': 'Role created successfully',
        }, status=status.HTTP_201_CREATED)
    
    def put(self, request, *args, **kwargs):
        """
        Handles the PUT request to update an existing role.

        This method validates the input data using the `UpdateRoleSerializer`.
        If the data is valid, it updates the role record in the `Roles` model
        and returns a success response. If the data is invalid, it returns an
        error response with details of the validation errors.

        Args:
            request: The HTTP request object containing the role data to be updated.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """
        serializer = UpdateRoleSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                'status':'INVALID_INPUT',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data

        role = Roles.objects.get(id = validated_data['id'])
        role.role = validated_data['role']
        role.save()

        log = Logs.objects.create(
            user=request.user,
            action=f'Role {role.role} updated'
        )

        return Response({
            'status': 'ROLE_UPDATED',
            'message': 'Role updated successfully',
        })
    
    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to delete an existing role.

        This method deletes the role record in the `Roles` model
        and returns a success response. If the role does not exist,
        it returns an error response.

        Args:
            request: The HTTP request object containing the role data to be deleted.
            *args: Additional positional arguments (not used in this method).
            **kwargs: Additional keyword arguments (not used in this method).
        
        Returns:
            Response: A Response object containing the status of the operation
                    and a message indicating success or failure.
        """
        try:
            role = Roles.objects.get(id=request.data['id'])
        except Roles.DoesNotExist:
            return Response({
                'status': 'ROLE_NOT_FOUND',
                'message': 'Role not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        role.delete()

        log = Logs.objects.create(
            user=request.user,
            action=f'Role {role.role} deleted'
        )

        return Response({
            'status': 'ROLE_DELETED',
            'message': 'Role deleted successfully',
        })


@api_view(['GET'])
@permission_classes([IsAdmin])
def get_logs(request):
    """
    Handles the GET request to retrieve a list of all logs.

    This function fetches all the log records from the `Logs` model
    and serializes them using the `GetLogSerializer`. It returns
    the serialized data in the response.

    Args:
        request: The HTTP request object containing metadata and any query parameters.

    Returns:
        Response: A Response object containing the serialized list of logs
                with HTTP 200 status.
    """
    logs = Logs.objects.all()
    serializer = GetLogSerializer(logs, many=True)
    return Response({
        'status':'SUCCESS',
        'data':serializer.data
    })