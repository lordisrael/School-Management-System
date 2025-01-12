# School Management System API

This is a backend API for managing a school system, built using Node.js, Express, MongoDB, and other related libraries. The API supports CRUD operations for schools, classrooms, students, and user authentication, along with role-based access control.

## Features

- **User Authentication**: Register and login users (super admins, school admins).
- **School Management**: Create, update, get, and delete schools.
- **Classroom Management**: Register classrooms, update classroom information, and assign students to classrooms.
- **Student Management**: Enroll, update, and transfer students between classrooms.
- **Role-based Authorization**: Only super admins and school admins have access to specific actions.

## Endpoints

### Authentication Routes
- **POST** `/api/v1/auth/register` - Register a new user
- **POST** `/api/v1/auth/login` - Login an existing user

### School Routes
- **POST** `/api/v1/school/register` - Register a new school (Super Admin only)
- **GET** `/api/v1/school/get_all_schools` - Get all schools (Super Admin only)
- **GET** `/api/v1/school/get_a_school/:id` - Get a specific school by ID (Super Admin only)
- **DELETE** `/api/v1/school/delete_school/:id` - Delete a school (Super Admin only)
- **PATCH** `/api/v1/school/update_school/:id` - Update school details (Super Admin only)

### Classroom Routes
- **POST** `/api/v1/classroom/register` - Create a new classroom (School Admin only)
- **GET** `/api/v1/classroom/get_all_classroom` - Get all classrooms (School Admin only)
- **GET** `/api/v1/classroom/get_a_classroom/:classroomId` - Get classroom details by ID (School Admin only)
- **PATCH** `/api/v1/classroom/update_classroom/:classroomId` - Update classroom information (School Admin only)
- **DELETE** `/api/v1/classroom/delete_classroom/:classroomId` - Delete a classroom (School Admin only)

### Student Routes
- **POST** `/api/v1/classroom/:classroomId/student/register` - Enroll a student in a classroom (School Admin only)
- **GET** `/api/v1/classroom/:classroomId/get_all_students` - Get all students in a classroom (School Admin only)
- **GET** `/api/v1/classroom/:classroomId/get_a_student/:studentId` - Get details of a specific student (School Admin only)
- **DELETE** `/api/v1/classroom/:classroomId/student/:studentId` - Remove a student from a classroom (School Admin only)
- **PATCH** `/api/v1/classroom/:classroomId/student/:studentId/transfer` - Transfer a student to another classroom (School Admin only)
- **PATCH** `/api/v1/student/:studentId` - Update a student's information (School Admin only)

## Middleware

- **authMiddleware**: Ensures that the user is authenticated.
- **isSuperAdmin**: Ensures the user is a super admin (for routes that require super admin access).
- **isSchoolAdmin**: Ensures the user is a school admin (for routes that require school admin access).

## Setup

### Prerequisites

- Node.js and npm (Node Package Manager)
- MongoDB (Local or MongoDB Atlas)
- Swagger (for API documentation)

### Installation

1. Clone the repository:
2. Install the dependencies:
npm install
3. Create a .env file in the root directory and add the following environment variables:
MONGO_URI=<your_mongo_database_uri>
PORT=<desired_port>
4. Run the server:
node app.js 

## API Documentation
The API will be running at https://school-management-system-wmlb.onrender.com/, and you can view the documentation at /api-docs.


## Testing
You can use tools like Postman or CURL to test the API endpoints. Alternatively, you can use the Swagger UI that is integrated into the API for easy testing.

## Contributing
Feel free to fork the repository and submit pull requests. Contributions are always welcome!

## License
This project is licensed under the MIT License - see the LICENSE file for details.

This `README.md` file provides a clear overview of your API, setup instructions, endpoint documentation, and contributing guidelines. Make sure to adjust any placeholders (like `<repository_url>`) to your actual project details.


