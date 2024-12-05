# SynapseAI

SynapseAI is an AI-powered study buddy application designed to enhance your learning experience through personalized study plans, interactive flashcards, and smart quizzes. The project features a safe JWT authentication system for new users, generating the user's previous progress and data when they are logged in. User's information and password are protected through a bcrypt hashing algorithm. Users can prompt our state of the art study bot with a topic they want to learn about or with a PDF study guide for an exam or course. The site will output a set of flashcards (as many as the user wants) that the user can add to their study set, which will track their progress through the topic and give insights about their studying. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm 6+
- PostgreSQL
- Install all other necessary dependencies by navigating to the root directory and run: pip install -r requirements.txt

### Local Database Setup

1) In your machine's terminal:
 ```bash
    brew install postgres
 ```
2) To enter the SQL shell:
   ```bash
   psql -u postgres
   ```
3) ```bash
   CREATE DATABASE qt_db;
   ```
4) ```bash
   CREATE USER '{your username}'@'localhost' IDENTIFIED BY '{your password}';
   ```
5) Fill out the backend environment file (see steps below)


The contents of your backend/.env file should be as follows:

SECRET_KEY=secrets.token_hex(32)
POSTGRES_USER={your username}
POSTGRES_PASSWORD={your password}
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=qt_db

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
