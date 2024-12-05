# SynapseAI

SynapseAI is an AI-powered study buddy application designed to enhance your learning experience through personalized study plans, interactive flashcards, and smart quizzes.

## Submission Link
(https://www.youtube.com/watch?v=CmgTmaORHOs)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm 6+
- PostgreSQL
- Run:
  ```bash
  pip install -r requiremets.txt
  ```

### Local Database Setup

- Install postgres on your local machine
- To access the SQL shell:
  ```bash
  psql -u postgres
  ```
- To create the local database:
  ```bash
  CREATE DATABASE qt_db;
  ```
- To create a new user:
  ```bash
  CREATE USER '{your username}'@'localhost' IDENTIFIED BY '{your password}';
  ```
- Initialize the backend/.env file as follows:
  ```bash
    SECRET_KEY=secrets.token_hex(32)
    POSTGRES_USER={your username}
    POSTGRES_PASSWORD={your password}
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_DATABASE=qt_db
  ```


### Installation

1. Clone the repository
2. Set up and start backend
    ```bash 
    cd backend
    pip install -r requirements.txt
    cd ..
    uvicorn backend.main:app --reload
    ```
3. Set up frontend
    ```bash 
    cd frontend
    npm install
    ```
5. Run frontend
    ```bash 
    npm start
    ```
The application should now be running on [http://localhost:3000](http://localhost:3000).
