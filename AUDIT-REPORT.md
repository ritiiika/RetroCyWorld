# Project audit and repair report

## Root causes found in the uploaded archive

1. **IntelliJ had no module registered.** The outer repository contains a frontend and a nested Maven backend, plus nested IDE metadata. Opening the outer directory as a generic project left the Modules list empty. The Java file then showed “Java file outside source root” and was not runnable.
2. **The backend was mostly scaffolding, not an implementation.** The controllers, entities, repositories, services, security classes, and DTOs in the uploaded ZIP were mostly empty package-only classes. The main class itself was valid, but there were no real API endpoints behind the frontend.
3. **The Maven build did not declare what the backend needed.** It lacked database-driver and Spring Security dependencies and had no working datasource configuration. The Dockerfile used Java 17 while the repaired app targets Java 21.
4. **Authentication and frontend API expectations were not connected.** The UI expected registration/login tokens, user profiles, posts, comments, follows and counts, while the archived backend did not implement those endpoints.
5. **The frontend production build failed on lint errors.** Several JSX text strings beginning with `//` triggered ESLint, and the Profile component had a hook dependency warning. The old default CRA test expected the removed “learn React” page.
6. **A few frontend actions were only visual.** The follow button only toggled local state and the like UI did not initialize from server state.

## Changes made

- Replaced the backend Maven setup with a consistent Spring Boot 3.5 / Java 21 setup and added Web, JPA, Security, Validation, PostgreSQL, H2 and test dependencies.
- Added a local H2 default database so the backend can be tried without installing PostgreSQL; added a PostgreSQL profile for a configured database.
- Implemented registration/login, BCrypt password storage, signed expiring JWTs, stateless security, CORS configuration, users/search/profile updates, posts, comments, follow relationships, and per-user post likes.
- Added model/repository implementations, response mapping to avoid serializing entity graphs, not-found/conflict responses, and delete cleanup for post comments/likes.
- Updated Docker to Java 21 and added `.dockerignore`.
- Made the frontend API URL configurable through `REACT_APP_API_URL`, unified login with the shared API service, corrected JSX lint issues and the Profile hook dependency, added label/input associations, and fixed follow/like UI behavior.
- Replaced the stale starter test with a login-screen smoke test and configured Jest compatibility for the frontend dependency versions.
- Removed nested IDE metadata and generated dependencies/build output from the repaired archive so IntelliJ can import the actual Maven project cleanly. The old `PostService.java` placeholder is retained but is not wired into the active controllers; post operations currently run through `PostController`.

## Verification performed

- **Frontend test:** passed (1 test).
- **Frontend production build:** passed.
- **JWT utility isolated check:** token validates for the expected email and rejects a modified token.
- **Backend full Maven build:** not verified in this environment because the Maven wrapper could not download Maven from Maven Central (network fetch failed). The backend source was checked for Java syntax patterns, but this is not a substitute for a real Maven compile. Run the wrapper on your computer and share the first build error if any appears.

## Run it

1. Extract the repaired ZIP.
2. In IntelliJ, use **File → Open** and open `backend/social-media-backend/pom.xml` (or open the `backend/social-media-backend` folder and load it as Maven). Set the Project SDK to JDK 21 and wait for dependency import. Do not create a new module.
3. In PowerShell from `backend/social-media-backend`, run `.\mvnw.cmd spring-boot:run`.
4. In a second terminal from `social-media-frontend`, run `npm ci` then `npm start`.
5. Open `http://localhost:3000`. Backend defaults to `http://localhost:8080` and an in-memory H2 database. Local data is reset when the backend stops.

For PostgreSQL, configure `SPRING_PROFILES_ACTIVE=postgres`, `DB_USERNAME`, `DB_PASSWORD`, and optionally a JDBC-form `DATABASE_URL`. Configure a strong random `JWT_SECRET` and `CORS_ALLOWED_ORIGINS` before deployment. The local JWT secret is for development only.

## Additional RetroCyWorld feature pass (October 2026)

- Added an Explore page with user search, post-text search, profile navigation, and useful empty/loading states.
- Added a Saved collection using browser-local storage, including live UI updates when a post is saved or unsaved.
- Added a Friends First feed mode using the existing `/users/{id}/timeline` API and chronological sorting, plus a manual refresh control.
- Made post comments expandable and loaded from `/comments/post/{postId}`; comment submission displays returned comments immediately. Added save/unsave, share-link copying, own-post deletion, and profile navigation from post headers.
- Replaced the profile edit placeholder alert with a real form wired to `PUT /users/{id}` for display name, username, and bio.
- Improved search dropdown, follow suggestions, empty states, responsive styling, and made navigation controls functional where a matching route/API exists.
- Kept the existing purple/cyan/magenta pixel theme and extended it rather than replacing the layout.
- **Limitations:** saved posts are local to the browser/device; persistent notifications and direct messaging are not implemented. The notification popover currently communicates that no new activity is available rather than inventing backend events. Follow endpoint currently supports following but not unfollowing.
- **Verification after feature pass:** frontend production build passed and frontend test suite passed (1 test). Backend was not changed in this pass; the earlier report's backend Maven-build limitation still applies.
