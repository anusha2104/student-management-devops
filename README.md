# UniCloud - Cloud-Based Student Management System

UniCloud is a web-based student management application built with React, Flask, and MySQL. It provides a dashboard to view, add, update, and delete student records.

## Features

- Student dashboard and student record management
- Add, view, update, and delete student records
- REST API built with Flask
- Persistent MySQL database storage
- Containerized frontend, backend, and database
- Jenkins CI/CD pipeline for automated build, testing, image publishing, and deployment to AWS EC2

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-SQLAlchemy |
| Database | MySQL 8 |
| Web server and API proxy | Nginx |
| Containerization | Docker, Docker Compose |
| CI/CD | Jenkins |
| Image registry | Docker Hub |
| Cloud deployment | AWS EC2 |

## Architecture

1. React provides the user interface.
2. Nginx serves the frontend and forwards `/api` requests to the Flask backend.
3. Flask exposes REST endpoints for student records.
4. MySQL stores student data in a persistent Docker volume.
5. Jenkins builds and tests the application, publishes Docker images, and deploys the services to AWS EC2.

## Run Locally

Requirements: Docker Desktop and Docker Compose.

From the repository root, run:

```powershell
docker compose up -d --build
```

Open the application at:

http://localhost:5173

Check the backend health endpoint:

http://localhost:5001/api/health

To inspect the running services:

```powershell
docker compose ps
```

To stop the services without deleting the database volume:

```powershell
docker compose down
```

**Note:** Do not use `docker compose down -v` unless you intentionally want to remove the database volume and its stored records.

## CI/CD Pipeline

The Jenkins pipeline is designed to:

1. Validate source files and Compose configuration.
2. Build the backend Docker image.
3. Run backend API tests against a temporary MySQL instance.
4. Build the frontend Docker image.
5. Publish versioned and `latest` images to Docker Hub.
6. Deploy the application to AWS EC2 using Docker Compose.

## Production Deployment

The production configuration is defined in `docker-compose.prod.yml`. It uses Docker Hub images and a persistent MySQL volume.

The EC2 security group must permit HTTP traffic on port 80 and SSH access for deployment. MySQL and the backend do not need public port mappings.

## Project Structure

```text
.
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app.py
â”‚   â”œâ”€â”€ models.py
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â”œâ”€â”€ test_app.py
â”‚   â””â”€â”€ Dockerfile
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ nginx.conf
â”‚   â””â”€â”€ Dockerfile
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ docker-compose.prod.yml
â””â”€â”€ Jenkinsfile
```

## Future Improvements

- Store production secrets using a secure secrets-management solution.
- Add authentication and role-based access control.
- Add automated frontend and integration tests.
- Configure HTTPS and domain-based access.
- Add application monitoring and deployment health checks.
