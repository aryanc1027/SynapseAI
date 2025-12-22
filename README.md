# SynapseAI

A location-based dating heatmap application that tracks locations and shows users where the hottest places in town are for dating and socializing.

## Overview

SynapseAI is essentially a glorified heatmap that tracks locations and tells people where the hottest places in town are for dating and other activities. The app will eventually be an iOS application.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React
- **Database**: PostgreSQL (Supabase for production)

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 14+
- PostgreSQL
- Poetry (for Python dependency management)

### Installation

1. Clone the repository
2. Set up backend:
   ```bash
   cd backend
   poetry install
   ```
3. Set up frontend:
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=your-database-name
```

### Running

**Backend:**

```bash
cd backend
poetry run uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).
