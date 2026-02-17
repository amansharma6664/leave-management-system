# Employee Leave Management System

A full-stack leave management application built with Spring Boot, React.js, and MySQL.

## Features

### For Employees

- Apply for leave with different leave types
- View leave history and status
- Track leave balance
- Cancel pending leave requests
- Responsive dashboard with statistics

### For Managers

- View all leave requests
- Approve or reject leave requests
- Add comments when approving/rejecting
- View pending requests dashboard
- Track team leave statistics

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT authentication
- Spring Data JPA & Hibernate
- MySQL Database
- Maven

### Frontend

- React.js 18
- React Router for navigation
- Axios for API calls
- CSS3 with responsive design
- Vite build tool

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE leave_management_db;

# Exit MySQL
exit
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Update database credentials in src/main/resources/application.properties
# Change these lines if needed:
# spring.datasource.username=root
# spring.datasource.password=root

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Demo Users

After starting the application, register users with these credentials:

### Employee Account

- Username: `employee`
- Password: `password`
- Role: Employee

### Manager Account

- Username: `manager`
- Password: `password`
- Role: Manager

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employee Endpoints

- `POST /api/employee/leaves` - Apply for leave
- `GET /api/employee/leaves` - Get my leave requests
- `GET /api/employee/leaves/balance` - Get leave balance
- `DELETE /api/employee/leaves/{id}` - Cancel leave request

### Manager Endpoints

- `GET /api/manager/leaves` - Get all leave requests
- `GET /api/manager/leaves/pending` - Get pending leave requests
- `PUT /api/manager/leaves/{id}/approve` - Approve/reject leave request

## Project Structure

```
leave-management-system/
├── backend/
│   ├── src/main/java/com/leavemanagement/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # JWT & authentication
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Context providers
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── database/
    └── init.sql            # Database initialization
```

## Features Implementation

### JWT Authentication

- Secure token-based authentication
- Role-based access control (Employee, Manager)
- Token stored in localStorage
- Automatic token injection in API requests

### Leave Management

- Apply for different leave types
- Date validation
- Overlap detection
- Leave balance tracking
- Manager approval workflow

### Responsive Design

- Mobile-first approach
- Responsive tables and forms
- Touch-friendly UI
- Hamburger menu for mobile

### Security

- Password encryption with BCrypt
- CORS configuration
- Protected API endpoints
- Role-based authorization

## Building for Production

### Backend

```bash
cd backend
mvn clean package
java -jar target/leave-management-backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist folder using a web server
```

## Configuration

### Database Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/leave_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Frontend API URL

Edit `frontend/src/services/api.js` to change the backend URL:

```javascript
const API_URL = 'http://localhost:8080/api';
```

## Troubleshooting

### Backend Issues

- **Port 8080 already in use**: Change server port in application.properties
- **Database connection failed**: Check MySQL credentials and ensure database exists
- **JWT errors**: Check JWT secret key in application.properties

### Frontend Issues

- **CORS errors**: Verify CORS configuration in SecurityConfig.java
- **API connection failed**: Check if backend is running on port 8080
- **Build errors**: Delete node_modules and run `npm install` again

## License

This project is created for educational purposes.

## Support

For issues and questions, please create an issue in the repository.
