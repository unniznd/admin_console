# Admin Console Backend
The backend of the project is built using Django. The backend is responsible for handling the business logic, managing the database and providing REST APIs for the frontend.

## How to run
Make sure you have the latest Python and pip installed on your system.
1. Clone the repository
2. Navigate to the backend directory `cd backend`
3. Run `pip install -r requirements.txt` to install the dependencies
4. Run `python manage.py migrate` to apply the migrations
5. Run `python manage.py runserver` to start the backend server

## API Endpoints
The backend has the following API endpoints:
1. `/api/users` - GET
2. `/api/admin/users` - GET, POST, PUT, DELETE
3. `/api/admin/roles` - GET, POST, PUT, DELETE
3. `/api/admin/logs` - GET

## API Documentation
The backend API documentation can be found [here](http://localhost:8000/redoc/)