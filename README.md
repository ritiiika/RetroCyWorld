# RetroSocial — Full-Stack Social Media Platform

React frontend + Spring Boot REST API + JPA, JWT authentication, and H2 for quick local development (PostgreSQL is supported through a profile).

## Start the backend

1. Install JDK 21.
2. Open `backend/social-media-backend` in IntelliJ by opening its `pom.xml` as a Maven project.
3. Wait for Maven import and set Project SDK to JDK 21.
4. In PowerShell, from `backend/social-media-backend`, run:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

The API listens on `http://localhost:8080`. Local default uses in-memory H2, so data is cleared when the backend stops.

## Start the frontend

1. Install Node.js 20 or 22.
2. Open another terminal in `social-media-frontend`.
3. Run:

   ```powershell
   npm ci
   npm start
   ```

4. Visit `http://localhost:3000`.

The frontend API base URL defaults to `http://localhost:8080`. Set `REACT_APP_API_URL` before building if the API runs elsewhere.

## Use PostgreSQL

Create a database named `social_media_db`, set `SPRING_PROFILES_ACTIVE=postgres`, and set `DB_USERNAME` / `DB_PASSWORD`. The default URL is `jdbc:postgresql://localhost:5432/social_media_db`; `DATABASE_URL` can override it but must be a JDBC URL. Set a long random `JWT_SECRET` outside local development.

## Implemented API routes

- `POST /auth/register`, `POST /auth/login`
- `GET /posts`, `GET /posts/{id}`, `GET /posts/user/{userId}`, `POST /posts`, `POST /posts/{id}/like`, `POST /posts/{id}/share`, `DELETE /posts/{id}`
- `GET /users/{id}`, `GET /users/email/{email}`, `GET /users/search?username=...`, `GET /users/{id}/posts`, `GET /users/{id}/followers/count`, `GET /users/{id}/following/count`, `GET /users/{id}/timeline`, `PUT /users/{id}`
- `GET /comments/post/{postId}`, `POST /comments`, `DELETE /comments/{id}`
- `POST /follow`

All routes except registration and login require a valid Bearer token. Passwords are stored as BCrypt hashes, not plain text.

## Frontend features

- Responsive Y2K / lo-fi anime themed navigation and user search.
- Main feed with **Everyone** and **Friends First** (self + followed accounts, newest first) modes.
- Create posts with text and optional image URL preview.
- Like/unlike posts through the backend, open and submit comments, share a post link, and delete your own posts.
- Explore users and search loaded posts; open user profiles from search and post headers.
- Edit your own display name, username, and bio through `PUT /users/{id}`.
- Save and unsave posts in a browser-local collection. This feature currently uses `localStorage`, so saved items are local to that browser/device and are not synced to a database or other devices.
- A small activity panel is present in the UI, but a persistent notifications API and direct messaging are not implemented yet.

The backend API and authentication flow were kept compatible with the existing frontend service layer. The frontend production build and test suite were run after these UI additions; the backend source was not changed for this feature pass.
