# API Documentation

Base URL: `http://localhost:3000/api`

## Table of Contents
- [Authentication](#authentication)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
- [Projects](#projects)
  - [Create Project](#create-project)
  - [Get User's Projects](#get-users-projects)
  - [Get Specific Project](#get-specific-project)
  - [Invite Member](#invite-member)
- [Tasks](#tasks)
  - [Create Task](#create-task)
  - [Update Task](#update-task)
  - [Delete Task](#delete-task)
- [Resources](#resources)
  - [Upload Resource](#upload-resource)
  - [Get Project Resources](#get-project-resources)

## Authentication

### Sign Up
Create a new user account.

**URL**: `/auth/sign-up`  
**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "email": "user@example.com",
    "name": "User Name",
    "password": "userpassword"
}
```

### Sign In
Authenticate existing user.

**URL**: `/auth/sign-in`  
**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "email": "user@example.com",
    "password": "userpassword"
}
```

## Projects

### Create Project
Create a new project.

**URL**: `/projects`  
**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "name": "Project Name",
    "description": "Project Description"
}
```

### Get User's Projects
Retrieve all projects for the authenticated user.

**URL**: `/projects`  
**Method**: `GET`

### Get Specific Project
Retrieve details for a specific project.

**URL**: `/projects/:projectId`  
**Method**: `GET`

### Invite Member
Invite a new member to a project.

**URL**: `/projects/:projectId/invite`  
**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "projectId": "project_id",
    "email": "member@example.com"
}
```

## Tasks

### Create Task
Create a new task.

**URL**: `/tasks`  
**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "title": "Task Title",
    "description": "Task Description",
    "due_date": "2024-12-31T00:00:00Z",
    "user_id": 1,
    "project_id": 2
}
```

### Update Task
Update an existing task.

**URL**: `/tasks/:taskId`  
**Method**: `PATCH`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
    "title": "Updated Task Title",
    "description": "Updated Description",
    "status": "COMPLETED",
    "priority": "HIGH"
}
```

### Delete Task
Delete a specific task.

**URL**: `/tasks/:taskId`  
**Method**: `DELETE`

## Resources

### Upload Resource
Upload a file resource to a project.

**URL**: `/resources`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: File to upload
- `file_name`: Name of the file
- `project_id`: ID of the project

### Get Project Resources
Retrieve all resources for a specific project.

**URL**: `/resources`  
**Method**: `GET`

**Query Parameters**:
- `project_id`: ID of the project