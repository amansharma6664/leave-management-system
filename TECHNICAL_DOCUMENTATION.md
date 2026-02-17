# Employee Leave Management System - Technical Documentation

## System Architecture

### Architecture Overview
```
┌─────────────────┐      HTTP/REST       ┌──────────────────┐
│   React.js      │ ←─────────────────→  │  Spring Boot     │
│   Frontend      │      JSON + JWT      │  Backend         │
│   (Port 3000)   │                      │  (Port 8080)     │
└─────────────────┘                      └──────────────────┘
                                                    │
                                                    │ JDBC
                                                    ↓
                                         ┌──────────────────┐
                                         │  MySQL Database  │
                                         │  (Port 3306)     │
                                         └──────────────────┘
```

## Backend Architecture

### Layer Architecture
1. **Controller Layer**: REST API endpoints
2. **Service Layer**: Business logic
3. **Repository Layer**: Data access
4. **Security Layer**: JWT authentication
5. **Model Layer**: JPA entities

### Security Implementation

#### JWT Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates JWT token
4. Client stores token in localStorage
5. Client includes token in Authorization header for subsequent requests
6. JwtAuthenticationFilter validates token on each request

#### Password Security
- Passwords encrypted using BCrypt
- Salt rounds: 10
- Never stored in plain text

### Database Schema

#### Users Table
```sql
users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  leave_balance DOUBLE DEFAULT 20.0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### User Roles Table
```sql
user_roles (
  user_id BIGINT,
  role VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

#### Leaves Table
```sql
leaves (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_days INTEGER NOT NULL,
  leave_type VARCHAR(50) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  approved_by BIGINT,
  manager_comments TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
)
```

## Frontend Architecture

### Component Structure
```
App (Router)
├── AuthContext (Global State)
├── Login
├── Register
├── PrivateRoute
│   ├── Dashboard
│   │   ├── Navbar
│   │   ├── LeaveForm
│   │   └── LeaveList
│   └── ManagerPending
│       ├── Navbar
│       └── LeaveList
```

### State Management
- **AuthContext**: User authentication state
- **Component State**: Local UI state with useState
- **API State**: Data from backend with useEffect

### Responsive Design Strategy
- Mobile-first approach
- CSS Grid for layouts
- Flexbox for components
- Media queries at breakpoints:
  - 640px (sm)
  - 768px (md)
  - 1024px (lg)

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Request:
```json
{
  "username": "employee",
  "password": "password"
}
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "username": "employee",
  "email": "employee@company.com",
  "fullName": "John Employee",
  "roles": ["EMPLOYEE"],
  "leaveBalance": 20.0
}
```

#### POST /api/auth/register
Request:
```json
{
  "username": "newuser",
  "email": "user@company.com",
  "password": "password123",
  "fullName": "New User",
  "department": "IT",
  "roles": ["EMPLOYEE"]
}
```

### Employee Endpoints

#### POST /api/employee/leaves
Request:
```json
{
  "startDate": "2024-03-15",
  "endDate": "2024-03-17",
  "leaveType": "CASUAL_LEAVE",
  "reason": "Personal work"
}
```

#### GET /api/employee/leaves
Returns array of leave requests for logged-in user

#### GET /api/employee/leaves/balance
Response:
```json
{
  "totalBalance": 20.0,
  "usedLeave": 5.0,
  "remainingBalance": 15.0,
  "pendingRequests": 2
}
```

#### DELETE /api/employee/leaves/{id}
Cancels a pending leave request

### Manager Endpoints

#### GET /api/manager/leaves
Returns all leave requests from all employees

#### GET /api/manager/leaves/pending
Returns only pending leave requests

#### PUT /api/manager/leaves/{id}/approve
Request:
```json
{
  "status": "APPROVED",
  "managerComments": "Approved for the dates requested"
}
```

## Business Logic

### Leave Application Workflow
1. Employee fills leave form
2. System validates:
   - Start date not in past
   - End date after start date
   - No overlapping leaves
   - Sufficient leave balance
3. System calculates number of days
4. Leave created with PENDING status
5. Manager reviews request
6. Manager approves/rejects with comments
7. If approved, leave balance deducted
8. If rejected, no balance change

### Leave Balance Management
- Initial balance: 20 days per year
- Balance deducted only on approval
- Balance restored if leave is cancelled
- Balance not affected by rejection

## Security Features

### Authentication
- JWT tokens with HS256 algorithm
- Token expiration: 24 hours
- Secure password hashing with BCrypt

### Authorization
- Role-based access control
- @PreAuthorize annotations
- Method-level security

### CORS Configuration
- Allowed origins: localhost:3000, localhost:5173
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials allowed: true

## Performance Optimizations

### Backend
- Connection pooling with HikariCP
- Lazy loading for relationships
- Indexed database columns
- Transaction management

### Frontend
- Code splitting with Vite
- Lazy loading of routes
- Optimized re-renders with React
- CSS bundling and minification

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for repositories
- Controller tests with MockMvc
- Security tests

### Frontend Testing
- Component tests with React Testing Library
- Integration tests
- E2E tests with Cypress

## Deployment

### Backend Deployment
```bash
mvn clean package
java -jar target/leave-management-backend-1.0.0.jar
```

### Frontend Deployment
```bash
npm run build
# Deploy dist folder to static hosting
```

### Environment Variables
Backend:
- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- JWT_SECRET
- JWT_EXPIRATION

Frontend:
- VITE_API_URL

## Monitoring and Logging

### Backend Logging
- SLF4J with Logback
- Log levels: DEBUG, INFO, WARN, ERROR
- Separate log files for application and access

### Frontend Logging
- Console logging in development
- Error tracking in production

## Future Enhancements

1. **Email Notifications**
   - Leave application confirmation
   - Approval/rejection notifications
   - Leave balance alerts

2. **Calendar Integration**
   - Visual calendar view
   - Export to Google Calendar/Outlook
   - Team availability calendar

3. **Advanced Reporting**
   - Leave analytics dashboard
   - Department-wise reports
   - Excel/PDF export

4. **Mobile App**
   - Native iOS/Android apps
   - Push notifications
   - Offline support

5. **Additional Features**
   - Leave carry-forward
   - Public holidays management
   - Multiple leave types configuration
   - Leave delegation
   - Bulk approval

## Troubleshooting Guide

### Common Issues

**Issue**: Backend cannot connect to database
**Solution**: Check MySQL is running and credentials are correct

**Issue**: CORS errors in frontend
**Solution**: Verify backend CORS configuration matches frontend URL

**Issue**: JWT token expired
**Solution**: User needs to login again

**Issue**: Leave balance not updating
**Solution**: Check transaction rollback in logs

## Code Quality Standards

### Backend
- Follow Spring Boot best practices
- Use dependency injection
- Implement proper exception handling
- Write meaningful commit messages

### Frontend
- Use functional components with hooks
- Follow React best practices
- Maintain component reusability
- Consistent code formatting

## Version History

- v1.0.0 - Initial release
  - Basic leave management
  - JWT authentication
  - Responsive UI
  - Role-based access
