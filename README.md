# Dragon Task 2.0

Dragon Task 2.0 is a full-stack task management application developed as a team project for WDD430 – Web Full-Stack Development at BYU–Idaho.

The application helps users organize their daily activities, create and update tasks, assign priorities, and manage tasks by category. Task information is stored persistently in MongoDB Atlas.

## Team Members

- Ronald Mullo — Team Lead
- Nicholas Kigozi — Team Member

## Live Application

https://dragon-task-production.onrender.com

## GitHub Repository

https://github.com/RonaldMullo/wdd430-team-dragon-task

## Main Features

- User authentication and protected dashboard
- Create, view, update, and delete tasks
- Assign task priorities
- Set due dates
- Organize tasks using categories
- Persist task data in MongoDB Atlas
- Responsive interface for desktop and mobile devices

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Auth.js / NextAuth
- MongoDB Atlas
- Render
- Git and GitHub

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

4. Create a `.env.local` file with the environment variables required by the application:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_auth_secret
   AUTH_TRUST_HOST=true
   DEMO_USER_EMAIL=your_demo_email
   DEMO_USER_PASSWORD=your_demo_password
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

**Security:** Environment variables and credentials must never be committed to GitHub.

## Deployment

The production application is deployed on Render and uses MongoDB Atlas for persistent data storage.

The deployment process includes:

1. Connecting the GitHub repository to a Render web service.
2. Configuring the required environment variables in Render.
3. Authorizing the Render outbound IP ranges in MongoDB Atlas.
4. Installing dependencies and building the Next.js application.
5. Starting the production server with `npm run start`.
6. Testing the deployed application and database persistence.

## API Routes

The application uses Next.js server-side API route handlers to communicate with MongoDB Atlas.

Task operations include creating, retrieving, updating, and deleting records. Category-related API functionality is also part of the application architecture.

## Known Issues and Opportunities for Improvement

- Render's free hosting tier may take additional time to respond after a period of inactivity.
- Additional automated testing could improve reliability.
- Future enhancements could include more advanced filtering, reminders, and reporting features.

## Course

WDD430 – Web Full-Stack Development  
Brigham Young University–Idaho