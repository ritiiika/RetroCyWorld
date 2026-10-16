# RetroSocial — local setup

Requirements: JDK 21, Node.js 20/22, npm. Internet is needed for the first dependency download.

## Backend
From `backend/social-media-backend`, run in Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The default local setup uses an in-memory H2 database so the server can start without installing PostgreSQL. Data resets when the backend stops. To use PostgreSQL, create `social_media_db`, set `DB_USERNAME` and `DB_PASSWORD`, and set `SPRING_PROFILES_ACTIVE=postgres`. `DATABASE_URL` can override the JDBC URL. Set a strong random `JWT_SECRET` for any deployment.

## Frontend
Open another terminal in `social-media-frontend`:

```powershell
npm ci
npm start
```

Open http://localhost:3000. The API runs on http://localhost:8080 by default.

## IntelliJ
Open `backend/social-media-backend/pom.xml` as a Maven project, choose JDK 21, and wait for Maven import. The source root is `backend/social-media-backend/src/main/java`. Do not create a new module named after the outer repository.
