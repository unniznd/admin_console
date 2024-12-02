# Admin Console Frontend
The frontend of the project is built using TypeScript and NextJS. The frontend is responsible for rendering the UI and handling user interactions. The frontend communicates with the backend using REST APIs.

## How to run
Make sure you have the latest NodeJS and yarn installed on your system.
1. Clone the repository
2. Navigate to the frontend directory `cd frontend`
3. Run `yarn install` to install the dependencies
4. Create a `.env.local` file in the frontend directory and add the following environment variables:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```
5. Navigate to the root directory of the project and run the backend server
6. Run `yarn run dev` to start the frontend server


## Routes
The frontend has the following routes:
1. `/` - Home page where the logged in user can see the username, name and role (if admin go to admin console button will be visible)
2. `/login` - Login page where the user can login
3. `/admin` - Admin console where the admin can manage users and roles and view logs


