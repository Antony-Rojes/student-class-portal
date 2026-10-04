# Student Class Portal

A centralized web portal developed for III CSE-A students to stay connected, track coding progress, access academic resources, and discover classmates' professional profiles through a single web application.

**Live Application:** https://csea-class-portal.web.app/

---

## Project Overview

The **Student Class Portal** is a web-based class management and student collaboration platform developed for III CSE-A.

The portal brings commonly used class resources and student-oriented services into one centralized interface. Instead of accessing separate platforms for coding progress, communication, academic resources, and professional networking, students can access these resources through a unified class workspace.

The project also demonstrates the practical implementation of modern web technologies, cloud services, authentication, database operations, external API integration, and web networking concepts.

### Objectives

- Provide a centralized digital workspace for the class.
- Allow authorized students to securely access the portal.
- Provide a weekly coding leaderboard based on LeetCode activity.
- Provide quick access to class communication and learning resources.
- Maintain a student directory with GitHub and LinkedIn profiles.
- Demonstrate integration of frontend technologies with Firebase services.
- Demonstrate real-world HTTP/HTTPS, DNS, API, and cloud-hosting concepts.

---

## Key Features

### Student Dashboard

The dashboard acts as the main workspace of the portal.

It provides access to:

- Weekly LeetCode leaderboard
- WhatsApp and class communication resources
- Classroom and learning links
- Academic resources
- Student social directory
- GitHub and LinkedIn profiles

The dashboard is designed to keep frequently used class resources accessible from one location.

### Google Authentication

The application uses **Firebase Authentication** with Google Sign-In.

Authentication provides controlled access to the class portal and allows the application to identify authenticated users before providing access to protected content.

**Authentication Flow:**

```text
Student
   |
   v
Student Class Portal
   |
   v
Google Authentication
   |
   v
Firebase Authentication
   |
   v
Authenticated User
   |
   v
Class Dashboard
