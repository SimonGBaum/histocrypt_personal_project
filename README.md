# HistoCrypt

A cryptogram puzzle application that pairs the satisfaction of clever
deduction with daily inspiration. Players unlock quotes by cracking
coded messages designed to challenge their logic and creative thinking.

## Features

- **Custom Play Options** — adjust difficulty and choose between
  alphabetic, numeric, and symbolic cipher styles.
- **Flexible Progress** — start, save, and resume puzzles at any time.
- **Personal Collection** — save favorite quotes and attach personal
  notes to reflect on later.

## Tech Stack

**Backend** — Django 6.0, Django REST Framework, SimpleJWT, PostgreSQL 15, psycopg 3

**Frontend** — React, Vite, React Router, Axios

**Infrastructure** — Docker, Docker Compose, Gunicorn, Nginx, GitHub Actions, AWS EC2

**External APIs** — ZenQuotes

## Prerequisites

- Docker Desktop (with WSL2 integration on Windows)
- Python 3.12+
- Node.js 20+
- Git

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/SimonGBaum/histocrypt_personal_project.git
cd histocrypt_personal_project
```

**2. Configure environment variables**

```bash
cp .env.example .env
```

Fill in the blank values in `.env`:

- `DJANGO_SECRET_KEY` — generate with:
  `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- `POSTGRES_PASSWORD` — any value for local development
- `ZENQUOTES_API_KEY` — your ZenQuotes API key

**3. Start the stack**

```bash
docker compose up -d --build
```

**4. Apply migrations**

```bash
docker compose exec backend python manage.py migrate
```

The API is now available at `http://localhost:8000`.

## Useful Commands

```bash
docker compose up -d              # Start services
docker compose down               # Stop services
docker compose logs backend -f    # Follow backend logs
docker compose exec backend bash  # Shell into the backend container
```

## Project Structure
histocrypt_personal_project/
├── client/ # React frontend (Vite)
├── server/ # Django backend
│ ├── histocrypt/ # Project settings, URLs, WSGI
│ ├── Dockerfile
│ └── requirements.txt
├── docker-compose.yml # Development configuration
├── .env.example # Environment variable template
└── README.md

## Project Status

**In active development.**

Division I — Scaffold & Containerization: **complete**

- Docker Compose environment with PostgreSQL and Django services
- Environment-driven configuration via python-dotenv
- CORS configured for cross-origin development
- Hot reload enabled through volume mounting

Next: Division II — Backend API and test coverage.