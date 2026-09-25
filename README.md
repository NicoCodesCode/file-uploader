# File Uploader

A file storage app with folders and authentication, built with Express and PostgreSQL, using a self-hosted, S3-compatible object store for file data.

## Quick Start

Requires Docker and Docker Compose. No local Node, Postgres, or storage server installation needed as everything runs in containers.

```bash
git clone https://github.com/NicoCodesCode/file-uploader.git
cd file-uploader
cp .env.example .env
```

Open `.env` and fill in real values for each variable (any local values work, these aren't shared with anything external).

```bash
docker compose up --build
```

Once all three containers are running, apply the database schema (only needed once, or after a fresh volume):

```bash
npx prisma migrate dev
```

The app is now available at `http://localhost:3000`. Sign up for a new account to try it. Uploads, downloads, folders, and deletes are all fully functional against the local Garage container.

## Tech Stack

- **Runtime**: Node.js, Express
- **Database**: PostgreSQL, via Prisma ORM
- **Object storage**: [Garage](https://garagehq.deuxfleurs.fr/), a self-hosted, S3-API-compatible storage server
- **Auth**: Passport (local strategy) + bcrypt, with sessions persisted in Postgres via `prisma-session-store`
- **Views**: EJS
- **Testing**: Jest + Supertest
- **Containerization**: Docker, Docker Compose

## Key Features

- Full auth flow
- Route-level auth protection
- Nested folder structure
- File upload, download, and delete backed by real S3-API object storage, not local disk
- Fully containerized local environment
- Automated tests

## Architecture

The Express app is the only thing the browser talks to. It stores structured data like users, sessions and folder/file metadata in Postgres via Prisma, and stores actual file bytes in Garage over the S3 API, using the `minio` npm package as an S3-compatible client. All three services run as separate containers on one Docker Compose network, addressing each other by service name (`db`, `garage`) rather than `localhost`.

## Testing

```bash
npm test
```

Tests run against a separate `file_uploader_test` database, created automatically the first time the Postgres container initializes (see `docker/init-test-db.sh`), so they never touch the main development database. Test env vars are swapped in before any test file loads (`jest.setup.js`), and the Prisma connection is explicitly closed after the full run (`jest.teardown.js`).

Tests run with `--forceExit`. This is intentional, not a workaround for a bug: `prisma-session-store` keeps a recurring background timer alive for its own session-cleanup logic, which is outside the app's control and has no effect on test correctness — it just keeps the process from exiting on its own once tests finish.

## Environment Variables

See `.env.example` for the full list of variables the app expects, with placeholder values and guidance for each.
