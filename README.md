# Student Class Portal

A web-based class portal developed for III CSE-A to provide a centralized platform for class resources, student information, and coding progress.

## Live Website

https://csea-class-portal.web.app/

## Features

- Google Authentication using Firebase
- Student dashboard
- Weekly LeetCode leaderboard
- Student social directory
- GitHub and LinkedIn profile links
- Class and academic resources
- Cloud-based data storage

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Firebase Authentication
- Google Authentication
- Cloud Firestore
- Firebase Hosting
- Node.js
- LeetCode GraphQL API
- Google Sheets
- GitHub

## LeetCode Leaderboard

The portal uses the LeetCode GraphQL API:

https://leetcode.com/graphql

The system retrieves recent accepted submissions and calculates weekly coding statistics.

Problems are categorized based on difficulty:

- Easy: 50 points
- Medium: 100 points
- Hard: 150 points

Weekly Score:

`(Easy × 50) + (Medium × 100) + (Hard × 150)`

The leaderboard update process is handled through:

`scripts/fetchLeetcode.js`

The script:

1. Retrieves student information from Firestore.
2. Gets the student's LeetCode username.
3. Fetches recent accepted submissions.
4. Filters submissions from the previous seven days.
5. Removes duplicate problems.
6. Retrieves problem difficulty.
7. Calculates the weekly score.
8. Stores the results in Firestore.

## Authentication

Students sign in using Google Authentication through Firebase.

Authentication Flow:

`Student → Google Sign-In → Firebase Authentication → Dashboard`

## Database

Cloud Firestore is used to store student information and leaderboard data.

The project uses collections such as:

- `users`
- `snapshots`

## Deployment

The application is deployed using Firebase Hosting and is available through HTTPS.

Live URL:

https://csea-class-portal.web.app/

## Web Technologies Concepts

This project demonstrates:

- URL structure
- DNS resolution
- HTTP and HTTPS
- HTTP requests and responses
- API integration
- GraphQL
- Chrome Network analysis
- Lighthouse performance analysis
- Cloud hosting
- Authentication
- Database integration

## Project Structure

```text
student-class-portal/
├── index.html
├── dashboard.html
├── leaderboard.html
├── social-media.html
├── css/
├── js/
├── scripts/
│   └── fetchLeetcode.js
├── firebase.json
├── firestore.rules
├── package.json
└── README.md

Security

Sensitive credentials such as Firebase service account files and private keys should not be committed to the repository.

For example:
serviceAccount.json

should remain private.

Future Improvements
- Historical leaderboard tracking
- More coding analytics
- Event and announcement management
- Improved student profiles
- Additional academic resources
- Automated leaderboard updates
- Improved mobile responsiveness

Author
M Antony Rojes Corera
```
