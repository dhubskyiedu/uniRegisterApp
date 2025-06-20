# A comprehensive web-based university recordkeeping system and LMS
## created by Denys Hubskyi

## The system is capable of:
### as per 20/06/2025:
- sign in and sign up users with different roles (teachers, students)
- keep them securely logged in during the same session unless they log out
- redirect them to the appropriate windows depending on their roles
### planned:
- changing password and details of users
- enroling to courses by students
- submitting files by students
- grading students by teachers
- assigning students to groups by teachers
- sending messages by users
- leaving comments by users

## The system consists of separate microservices:
### currently:
- frontend: ReactTS (NextJS with TypeScript), run on port 3000
- backend: NodeJS + SQLite, run on port 3001
### planned:
- ML platform: Python (Flask, SkLearn or Keras)
- separate admin frontend and backend: NodeTS + TypeORM

## The microservices communicate via:
### currently:
- REST API
### planned:
- GraphQL

## The microservices are run in Docker containers
- docker-compose is used to launch the entire app simultaneously

## Database is SQLite-based
- uses SQL queries
- might be substituted with TypeORM later
