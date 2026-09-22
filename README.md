# TaskFlow – Role-Based Task Management System

TaskFlow is a role-based task management system with clean, enterprise-grade architecture for both frontend and backend.

## Project Structure

```
Taskflow/App/
├── frontend/             # React 19 + Vite + Tailwind CSS + React Router DOM
│   ├── src/
│   │   ├── components/   # Common, Layout, Dashboard & Task components
│   │   ├── pages/        # Auth, Admin & User pages
│   │   ├── services/     # Axios REST clients (configured for http://localhost:8080/api)
│   │   ├── context/      # AuthContext for role-based sessions & JWT token storage
│   │   ├── routes/       # ProtectedRoute, AdminRoute & AppRoutes
│   │   └── utils/        # Constants, design tokens & helpers
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/              # Spring Boot 3.3 + Spring Security 6 + Spring Data JPA + JJWT
    ├── pom.xml
    └── src/main/
        ├── java/com/taskflow/
        │   ├── config/      # CORS, SecurityFilterChain, and DataInitializer
        │   ├── controller/  # AuthController, TaskController, UserController
        │   ├── dto/         # Request & Response DTOs
        │   ├── entity/      # User, Task, Comment JPA Entities
        │   ├── repository/  # Spring Data JPA Repositories
        │   ├── security/    # JwtTokenProvider & JwtAuthenticationFilter
        │   └── service/     # AuthService, TaskService, UserService
        └── resources/
            └── application.yml  # Database (H2 / MySQL) & JWT configuration
```

---

## 1. Running the Frontend

### Prerequisites
- Node.js (v18+)
- npm

### Commands
```bash
cd frontend
npm install
npm run dev
```
- The frontend will start at: **http://localhost:5173**

### Test Accounts
- **Admin**: `admin@taskflow.com` / `password123`
- **User**: `sarah.jenkins@taskflow.com` / `password123`
- *Or use the one-click "Fill Admin" / "Fill User" demo buttons on the login card.*

---

## 2. Running the Backend

### Prerequisites
- Java 17+ (Java 25 supported)
- Apache Maven 3.8+

### Commands
```bash
cd backend
mvn spring-boot:run
```
- The backend REST API will start at: **http://localhost:8080/api**
- In-memory H2 database console: **http://localhost:8080/api/h2-console** (JDBC URL: `jdbc:h2:mem:taskflowdb`)
- To switch to MySQL, configure `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` in `application.yml` or environment variables.

---

## 3. Role Access Model

| Resource | Admin Access | User Access |
| :--- | :---: | :---: |
| Login / Auth | Yes | Yes |
| Admin Dashboard | Yes | No (Redirected) |
| Task Management (Create/Edit/Delete) | Yes | Read/Status/Comments Only |
| User Management | Yes | No (Redirected) |
| Reports & Analytics | Yes | No (Redirected) |
| User Dashboard & My Tasks | Yes | Yes |
| Profile | Yes | Yes |
