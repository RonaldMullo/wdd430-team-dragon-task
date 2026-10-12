# Dragon Task 2.0

Dragon Task 2.0 is a full-stack task management application developed as a team project for WDD430 - Web Full-Stack Development

The application helps users organize tasks, manage priorities, set due dates, and organize activities into categories. Data is stored in MongoDB Atlas.

## Team Members

- Ronald Mullo - Team Lead
- Nicholas Kigozi - Team Member

## Live Application

https://dragon-task-production.onrender.com

## GitHub Repository

https://github.com/RonaldMullo/wdd430-team-dragon-task

## Main Features

- User registration with securely hashed passwords
- User login and logout using Auth.js
- Protected application routes
- Individual task and category data for each user
- Dashboard with task statistics
- Create, view, update, and delete tasks
- Create, view, update, and delete categories
- Assign task priorities and due dates
- Organize tasks by category
- Persistent data storage using MongoDB Atlas
- Responsive interface for desktop and mobile devices

## Application Pages

- `/register` - Create a new account
- `/login` - Sign in
- `/dashboard` - View task statistics
- `/tasks` - Manage tasks
- `/categories` - Manage categories

## Technologies

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Auth.js / NextAuth
- bcryptjs
- Zod
- MongoDB Atlas
- Render
- Git and GitHub
- ESLint and Prettier

## Project Architecture

The application uses Next.js App Router with server-side API route handlers.

The frontend communicates with the API, which validates requests and performs database operations using MongoDB Atlas.

Authentication is managed through Auth.js. Task and category operations use the authenticated user's ID to restrict access to their own records.

Reusable React components support the dashboard, navigation, task management, category management, and authentication interface.

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/RonaldMullo/wdd430-team-dragon-task.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wdd430-team-dragon-task
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_generated_auth_secret
   AUTH_TRUST_HOST=true
   AUTH_URL=http://localhost:3000
   DEMO_USER_EMAIL=your_demo_email
   DEMO_USER_PASSWORD=your_demo_password
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

## Available Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `/api/auth/*` - Auth.js authentication handlers

### Tasks

- `GET /api/tasks` - List the current user's tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks/[id]` - Retrieve a task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Categories

- `GET /api/categories` - List the current user's categories
- `POST /api/categories` - Create a category
- `GET /api/categories/[id]` - Retrieve a category
- `PUT /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

Task and category endpoints require authentication.

## Security

- Passwords are hashed using bcryptjs.
- Protected routes require authentication.
- API operations are scoped to the authenticated user.
- Task category assignments are validated against user ownership.
- Input validation is applied to API requests.
- Environment variables and credentials must not be committed to GitHub.

User registration is protected by MongoDB-backed IP-based rate limiting (5 requests per 15 minutes). Login rate limiting and automated security testing remain future improvements..

## Deployment

The application is deployed using Render and MongoDB Atlas.

Deployment steps:

1. Connect the GitHub repository to a Render web service.
2. Configure environment variables in Render.
3. Configure MongoDB Atlas network access.
4. Install dependencies and build the Next.js application.
5. Start the production server using `npm run start`.
6. Verify authentication, API operations, and database persistence.

## Testing

The following functionality has been tested locally:

- User registration and automatic sign-in
- Login and logout
- Protected pages
- Dashboard statistics
- Task and category persistence
- Separation of data between accounts
- Rejection of access to another user's task
- Successful production build

## Known Limitations and Future Improvements

- Render's free tier may respond slowly after inactivity.
- Additional automated tests are recommended.
- Login rate limiting and additional security hardening are recommended before broader public use.
- Future features may include reminders, advanced filtering, and reporting.

## Course

WDD430 - Web Full-Stack Development
