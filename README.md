# Course API

A small Express API that serves as the working project for the Claude Code course.

## Getting started

```bash
npm install
npm run dev     # start the API on http://localhost:3000
npm test        # run the tests
npm run lint    # lint the code
```

## Endpoints

| Method | Path          | Description                   |
|--------|---------------|-------------------------------|
| GET    | `/health`     | Liveness check                |
| GET    | `/users`      | List all users                |
| GET    | `/users/:id`  | Get one user (404 if missing) |
| POST   | `/users`      | Create a user                 |
| PUT    | `/users/:id`  | Update an existing user       |

See `docs/api.md` for request and response details.
