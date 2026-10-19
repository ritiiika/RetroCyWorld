# RetroCyWorld ✦

A retro-inspired social media platform built with React and Spring Boot, featuring a neon digital-universe aesthetic. Create posts, interact with other users, follow people, and explore a community through a distinctive retro interface.

**Live Website:** https://retro-cy-world.vercel.app  
**Backend API:** https://retrocyworld.onrender.com  
**Database:** PostgreSQL on Supabase

## Features

- User registration and login
- JWT-based authentication
- Create and view posts
- Like, comment on, save, and share posts
- User profiles and profile updates
- Search for users
- Follow and unfollow users
- View user posts, followers, and following
- Personalized user timelines
- Persistent PostgreSQL storage
- Retro-inspired user interface

## Tech Stack

**Frontend**
- React.js
- JavaScript
- Axios
- CSS

**Backend**
- Java 21
- Spring Boot 3.5.x
- Spring Web
- Spring Data JPA and Hibernate
- Spring Security
- JWT authentication
- Maven

**Database and Deployment**
- PostgreSQL — Supabase
- H2 — local development
- Docker
- Render — backend hosting
- Vercel — frontend hosting

## Architecture

```text
             User / Browser
                    |
                    v
          React Frontend (Vercel)
                    |
              HTTPS / REST API
                    |
                    v
        Spring Boot Backend (Render)
                    |
               JDBC / JPA
                    |
                    v
          PostgreSQL (Supabase)
```

## Project Structure

```text
RetroCyWorld-enhanced/
├── backend/
│   └── social-media-backend/
│       ├── src/
│       ├── pom.xml
│       └── Dockerfile
│
└── social-media-frontend/
    ├── public/
    ├── src/
    │   └── services/
    │       └── postService.js
    ├── package.json
    └── .env
```

## Getting Started

### Prerequisites

Install the following before running the project locally:

- Git
- Java 21 JDK
- Node.js and npm
- Maven, or the included Maven wrapper if available

### 1. Clone the repository

```bash
git clone https://github.com/ritiiika/RetroCyWorld.git
cd RetroCyWorld
```

If your repository URL differs, use the clone URL displayed on your GitHub repository page.

### 2. Start the backend

Open a terminal in the backend directory:

```bash
cd backend/social-media-backend
```

On Windows PowerShell, run:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, run:

```bash
./mvnw spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

The default local configuration is intended to use an in-memory H2 database. The backend normally runs at:

`http://localhost:8080`

Note: Data stored in an in-memory database is not persistent after the backend stops.

### 3. Start the frontend

Open a second terminal:

```bash
cd social-media-frontend
npm install
npm start
```

Open the application in your browser:

`http://localhost:3000`

## Environment Variables

### Frontend Configuration

For local development, create a `.env` file inside `social-media-frontend`:

```env
REACT_APP_API_URL=http://localhost:8080
```

For the deployed Vercel frontend, configure:

```env
REACT_APP_API_URL=https://retrocyworld.onrender.com
```

Restart the local development server after changing `.env`. For Vercel, trigger a new deployment so the updated variable is included in the frontend build.

### Backend Configuration

Set the following variables in your hosting provider's environment settings. Never commit real passwords or secrets.

| Variable | Description |
|---|---|
| `PORT` | HTTP port supplied by the hosting platform |
| `SPRING_PROFILES_ACTIVE` | Set to `postgres` for PostgreSQL deployment |
| `DATABASE_URL` | JDBC URL for PostgreSQL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_DRIVER` | PostgreSQL driver: `org.postgresql.Driver` |
| `JWT_SECRET` | Strong, unique JWT signing secret |
| `JWT_EXPIRATION_SECONDS` | JWT lifetime in seconds; defaults to `86400` |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins |

Example PostgreSQL URL format:

```text
jdbc:postgresql://<pooler-host>:5432/postgres?sslmode=require
```

Replace `<pooler-host>` with the actual Supabase Session Pooler hostname. Use the exact username and connection details shown in Supabase's **Connect** dialog.

Do not include actual database passwords or JWT secrets in this README.

## API Overview

The frontend API service uses the following backend endpoint paths:

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/auth/register` |
| Login | POST | `/auth/login` |
| List posts | GET | `/posts` |
| Get post | GET | `/posts/{id}` |
| Posts by user | GET | `/posts/user/{userId}` |
| Create post | POST | `/posts` |
| Like post | POST | `/posts/{postId}/like` |
| Share post | POST | `/posts/{postId}/share` |
| Delete post | DELETE | `/posts/{id}` |
| Get user | GET | `/users/{id}` |
| Find user by email | GET | `/users/email/{email}` |
| User posts | GET | `/users/{id}/posts` |
| Followers count | GET | `/users/{id}/followers/count` |
| Following count | GET | `/users/{id}/following/count` |
| User timeline | GET | `/users/{id}/timeline` |
| Search users | GET | `/users/search?username={username}` |
| Update user | PUT | `/users/{id}` |
| Comments for post | GET | `/comments/post/{postId}` |
| Add comment | POST | `/comments` |
| Delete comment | DELETE | `/comments/{id}` |
| Follow user | POST | `/follow` |

Some endpoints may require a valid JWT. Refer to the backend security configuration for the actual authorization rules.

## Deployment

### Backend — Render

1. Connect the GitHub repository to a Render Web Service.
2. Set the root directory to `backend/social-media-backend`.
3. Use Docker if deploying with the project's Dockerfile.
4. Configure the PostgreSQL profile and required environment variables.
5. Deploy and inspect the application logs.
6. Confirm Spring Boot starts and establishes a database connection.

### Database — Supabase

1. Create a PostgreSQL project.
2. Open **Connect** and select the appropriate connection method, such as Session Pooler.
3. Copy the database host, port, database name, and username.
4. Configure the JDBC URL and credentials in Render.
5. Keep SSL enabled and never expose the database password.

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to `social-media-frontend`.
3. Configure the build command as `npm run build`.
4. Set the output directory to `build`.
5. Add `REACT_APP_API_URL=https://retrocyworld.onrender.com`.
6. Deploy the frontend.
7. Verify that backend CORS configuration allows the deployed frontend origin.

## Troubleshooting

### Registration or login fails with a CORS error

- Verify that `CORS_ALLOWED_ORIGINS` includes the exact frontend origin.
- For the current deployment, the origin is `https://retro-cy-world.vercel.app`.
- Ensure Spring Security enables CORS and applies the allowed origins to API and preflight requests.
- Redeploy the backend after configuration changes.

### Requests still use localhost

- Check the Vercel environment variable `REACT_APP_API_URL`.
- Confirm the frontend API service reads the variable correctly.
- Redeploy the frontend after changing environment variables.

### Database connection fails

- Ensure the JDBC URL starts with `jdbc:postgresql://`.
- Verify the hostname, port, username, and password.
- Keep `sslmode=require` in the connection URL.
- Check Render logs for connection or authentication errors.

### API returns 401 or 403

The request may require a valid JWT or may be blocked by the security configuration. Check the request headers and backend security rules rather than disabling authentication globally.

### First request is slow

Render free instances may spin down after inactivity, which can delay the first request. Check the service logs before assuming the backend is unavailable.

## Security Notes

- Never commit database credentials, JWT secrets, API keys, or secret-bearing `.env` files.
- Use a strong, unique JWT signing secret in production.
- Rotate any credentials that have been exposed in logs, screenshots, commits, or messages.
- Restrict CORS to trusted frontend origins.
- Enforce authentication and authorization on the backend.

## Contributing

1. Fork the repository or create a feature branch.
2. Make your changes.
3. Test the frontend and backend.
4. Commit with a descriptive message.
5. Open a pull request describing the changes and tests.

## License

No license has been specified yet. Add a `LICENSE` file before granting others permission to reuse or redistribute this project.

---

**Built with Java, React, PostgreSQL, and retro-futuristic energy.**
