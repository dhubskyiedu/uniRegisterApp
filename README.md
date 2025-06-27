# A comprehensive web-based university recordkeeping system and LMS
## created by Denys Hubskyi

## The system is capable of:
### as per 27/06/2025:
- sign in and sign up users with **different roles (teachers, students, admins)**
- keep them securely logged in during the same session unless they log out
- redirect them to the appropriate windows depending on their roles
- teachers view students list
- users change their personal details (first, last names) and security details (password, email)
- users are able to delete their accounts
- users are greeted with a message **showing the weather in their approximate IP geolocation**
- admin dashboard created, **GraphQL admin backend created**
### planned:
- enrolling to courses by students
- **submitting files by students**
- grading students by teachers
- assigning students to groups by teachers
- **sending internal messages by users (using GraphQL subscriptions or Socket.IO)**
- leaving comments by users
- **resetting passwords via email security codes (using SMTP)**
- **hashing passwords stored in the DB (using bcrypt)**

## The system consists of separate microservices:
### currently:
- frontend: React (NextJS with TypeScript), run on port 3000
- backend: NodeJS + SQLite, run on port 3001
- GraphQL dashboard: Apollo, run on port 3010
### planned:
- ML platform: Python (Flask + SkLearn or Keras)

## The microservices communicate via:
### currently:
- REST API
### planned:
- GraphQL

## The microservices are run in Docker containers
- **docker-compose is used** to launch the entire app simultaneously

## Database is SQLite-based
- uses SQL queries (queries are executed in a specially designed mini-library written by me dedicated to SQL operations)
- might be substituted with TypeORM later

## Security
- role-based authentication
- **JWT secure http-only cookies session security**
- dedicated frontend verification
- Security-conscious RESTful API architecture (all verifications via POST requests, password verification exclusively at the backend)

## Future refinements
### Planned refinements
- code linting in the entire project
- cyber security audit of the entire project
- unit and functional testing of the entire project
- RESTful API optimization: standardization of server responses
- interface and type standardization within the entire project
- logging all server error messages in text files in a dedicated folder
## Considered refinements
- finer microservices decoupling: establishing dedicated containers for handling the operations of each of the user types separately