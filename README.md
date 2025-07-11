# Quiz App

**Default Accounts for Testing:**

- **Admin:** admin@quizapp.com / Admin@123
- **Teacher:** teacher@quizapp.com / Teacher@123

---

## Features

### For Students

- View available quizzes with duration and details
- Take quizzes (multiple attempts allowed)
- View your score immediately after submission
- See your quiz history and scores in your profile, sorted from newest to oldest

### For Teachers

- Create, edit, and delete quizzes (multiple question types: multiple-choice, true/false, short answer)
- View all quizzes you have created
- See all student submissions for each quiz

### For Admins

- Manage users and quizzes (extendable)

### Authentication

- Signup, login, email verification
- Password reset and forgot password flows
- Role-based access control

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Zustand, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Joi, Helmet, CORS, Nodemailer/Mailtrap
- **Other:** ESLint, dotenv

---

## Folder Structure

```
Quiz App/
  client/      # React frontend
  server/      # Node.js/Express backend
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Mailtrap account (for email testing)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Quiz App"
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## API Endpoints

### Auth

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/check-auth` - Check authentication (protected)
- `GET /api/v1/auth/users` - Get all users (admin only)
- `PATCH /api/v1/auth/users/:id/role` - Update user role (admin only)
- `DELETE /api/v1/auth/users/:id` - Delete user (admin only)

### Quizzes

- `POST /api/v1/quizzes` - Create quiz (teacher)
- `GET /api/v1/quizzes/my` - Get all quizzes created by the logged-in teacher
- `GET /api/v1/quizzes/available` - List quizzes for students
- `GET /api/v1/quizzes/:id` - Get a single quiz by ID
- `PUT /api/v1/quizzes/:id` - Edit quiz (teacher)
- `DELETE /api/v1/quizzes/:id` - Delete quiz (teacher)

### Submissions

- `POST /api/submissions` - Submit quiz answers
- `GET /api/submissions/my` - Get student's own submissions
- `GET /api/submissions/results/:studentId` - Get all submissions for a student (admin/student)
- `GET /api/submissions/quiz/:id` - Get all submissions for a quiz (teacher)
