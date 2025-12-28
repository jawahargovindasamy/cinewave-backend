# CineWave Backend

A Node.js/Express backend for CineWave providing authentication (email/password + Google OAuth), password reset via email, watchlist management, and continue-watching tracking. Built with MongoDB/Mongoose, secured with JWT, Helmet, and CORS.

## Features
- User registration and login with JWT
- Google OAuth 2.0 login
- Protected routes using Bearer tokens
- Watchlist CRUD with statuses (plan_to_watch, watching, on_hold, dropped, completed)
- Continue watching tracking for movies and TV episodes
- Password reset flow that generates a random password and emails it to the user
- Input validation with express-validator
- Security middleware (Helmet, CORS)
- Health check endpoint

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken)
- Passport (Google OAuth, JWT strategy)
- Nodemailer (SMTP)
- express-validator, Helmet, CORS, dotenv

## Requirements
- Node.js 18+ (ESM enabled)
- MongoDB 6+ (local or hosted, e.g., MongoDB Atlas)
- Google Cloud OAuth 2.0 credentials (for Google login)
- SMTP credentials (for password reset emails)

## Getting Started

1) Clone and install dependencies
- Ensure you are inside the Backend directory.

```
npm install
```

2) Configure environment variables
- Copy .env.example to .env and fill in values.

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=change_me_in_production
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

FRONTEND_URL=http://localhost:5173
```

3) Run the server

- Development (auto-reload):
```
npm run dev
```
- Production:
```
npm start
```

The API will be available at http://localhost:5000 (or the PORT you configured).

## Project Structure
```
src/
  config/
    database.js           # Mongoose connection
    passport.js           # Passport strategies (Google, JWT)
  controllers/
    authController.js     # Register/Login/GetMe
    passwordController.js # Forgot password
    continueWatchingController.js
    watchlistController.js
  middleware/
    authMiddleware.js     # JWT protect, token generator
    validationMiddleware.js
  models/
    User.js
    Watchlist.js
    ContinueWatching.js
  routes/
    authRoutes.js
    passwordRoutes.js
    continueWatchingRoutes.js
    watchlistRoutes.js
  utils/
    emailService.js       # Nodemailer wrapper
    passwordGenerator.js
  index.js                # App entry point
```

## Scripts
- npm run dev: Start server with nodemon
- npm start: Start server with node

## Environment Variables
- PORT: HTTP port to listen on (default 5000)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret used to sign JWTs (must be strong in production)
- JWT_EXPIRE: JWT expiration (e.g., 7d, 1h)
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth client secret
- CALLBACK_URL: Backend Google OAuth callback URL (e.g., http://localhost:5000/api/auth/google/callback)
- EMAIL_HOST: SMTP host (e.g., smtp.gmail.com)
- EMAIL_PORT: SMTP port (e.g., 587)
- EMAIL_USER: SMTP username (sender email)
- EMAIL_PASS: SMTP password or app password
- FRONTEND_URL: Frontend origin used for CORS and OAuth redirection (e.g., http://localhost:5173)

## API Reference
Base URL: http://localhost:5000

### Health
- GET /api/health
  - Response: { status: "OK", timestamp: string }

### Authentication

- POST /api/auth/register
  - Body: { name: string, email: string, password: string }
  - 201 Response: { _id, name, email, token }

- POST /api/auth/login
  - Body: { email: string, password: string }
  - 200 Response: { _id, name, email, token }

- GET /api/auth/me
  - Headers: Authorization: Bearer <token>
  - 200 Response: user object without password

### Google OAuth
- GET /api/auth/google
  - Initiates the Google login flow.
- GET /api/auth/google/callback
  - On success, redirects to: FRONTEND_URL/login?token=<JWT>
  - On failure, redirects to: FRONTEND_URL/login

Setup notes:
- In Google Cloud Console, create an OAuth 2.0 Client (Web application).
- Authorized redirect URI: CALLBACK_URL (e.g., http://localhost:5000/api/auth/google/callback)
- Authorized JavaScript origins: Frontend origin (e.g., http://localhost:5173)

### Password
- POST /api/password/forgot
  - Body: { email: string }
  - Behavior: Generates a new random password, saves it for the user, and emails it using SMTP.
  - 200 Response: { message: string, success: true }

### Watchlist
All Watchlist routes require Authorization: Bearer <token>

- GET /api/watchlist
  - Query params (optional): status, mediaType
  - 200 Response: array of watchlist items

- POST /api/watchlist
  - Body: { mediaType: "movie"|"tv", mediaId: number, status?: "plan_to_watch"|"watching"|"on_hold"|"dropped"|"completed" }
  - Upserts an item (creates if missing, otherwise updates status if provided)
  - 200 Response: the upserted item

- PUT /api/watchlist/:id
  - Body: { status: one of the allowed statuses }
  - 200 Response: updated item

- DELETE /api/watchlist/:id
  - 200 Response: { message: "Removed from watchlist" }

### Continue Watching
All routes require Authorization: Bearer <token>

- GET /api/continue-watching
  - 200 Response: array of recent continue-watching entries (sorted by lastWatchedAt desc, limited to 20)

- POST /api/continue-watching
  - Body: { mediaType: "movie"|"tv", mediaId: number, seasonNumber?: number|null, episodeNumber?: number|null }
  - Upserts or updates the entry and sets lastWatchedAt
  - 200 Response: entry

- DELETE /api/continue-watching
  - Body: { mediaType: "movie"|"tv", mediaId: number, seasonNumber?: number|null, episodeNumber?: number|null }
  - 200 Response: { message: "Removed from continue watching" }

## Example Requests

Register:
```
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Secret123!"}'
```

Login:
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret123!"}'
```

Me:
```
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

Add to watchlist:
```
curl -X POST http://localhost:5000/api/watchlist \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"mediaType":"movie","mediaId":550,"status":"watching"}'
```

Get continue watching:
```
curl http://localhost:5000/api/continue-watching \
  -H "Authorization: Bearer <token>"
```

## Validation and Error Responses
- Validation errors return 400 with shape:
```
{
  "errors": [
    { "type": "field", "msg": "Email is required", "path": "email", ... }
  ]
}
```
- Auth failures return 401 with:
```
{ "message": "Not authorized, token failed" }
```
- Server errors may return 500 with:
```
{ "message": "Something went wrong!" }
```

## Security Notes
- Always set a strong, unique JWT_SECRET in production.
- Configure CORS origin via FRONTEND_URL.
- Helmet is enabled by default.
- Do not log tokens or secrets in production logs.

## Email (SMTP) Notes
- EMAIL_USER must be allowed to send via your SMTP provider.
- For Gmail, create an App Password and use it as EMAIL_PASS; regular passwords usually won’t work.
- Ensure your SMTP port and host match your provider settings.

## MongoDB Notes
- For local dev, ensure MongoDB is running and MONGODB_URI is correct.
- For Atlas, use the connection string from Atlas and allow your IP address.

## OAuth Notes
- CALLBACK_URL must match the Authorized redirect URI in Google Cloud Console.
- FRONTEND_URL must be the origin that receives the token via redirect.

## Troubleshooting
- Error: JWT_SECRET is missing from environment variables
  - Set JWT_SECRET in .env
- Google OAuth environment variables are missing
  - Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Failed to send email
  - Verify EMAIL_HOST/PORT/USER/PASS and provider-specific settings
- MongoDB connection error
  - Verify MONGODB_URI and database availability
- CORS errors
  - Ensure FRONTEND_URL matches your frontend origin

## License
ISC

## Author
Jawahar
