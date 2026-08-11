# CampusConnect

**CampusConnect** is a cross-platform mobile and web app built with **Expo** and **React Native** that helps students stay connected with campus life. Admins can publish announcements, events, study materials, and class schedules. Regular users can view all content, RSVP to events, and manage their profile.

---

## Project Demo

### Login Screen
Branded sign-in portal with email/password authentication.

![CampusConnect Login Screen](./assets/Screenshot%201.png)

### Admin Command Center
Full admin dashboard for creating content and managing user roles.

![CampusConnect Admin Panel](./assets/Screenshot%202.png)

### Announcements Feed
Real-time announcements with search, category filters, and admin delete controls.

![CampusConnect Announcements](./assets/Screenshot%203.png)

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Email/password sign up and login via Firebase Auth |
| **Announcements** | Real-time feed with search and category filters (General, Academic, Event, Urgent) |
| **Events** | Browse events, RSVP, and see attendee counts |
| **Schedule** | Weekly class schedule grouped by day |
| **Materials** | Upload and browse study files (PDF, images, documents) |
| **Profile** | View role, update profile photo, logout |
| **Admin Panel** | Create content, view all users, promote/revoke admin roles |
| **Push Notifications** | Expo Notifications integration (token stored on user profile) |

---

## Role-Based Access Control (RBAC)

| Role | Permissions |
|------|---------------|
| **Super Admin** (`lidiyamesenbet16@gmail.com`) | Always admin on login; can create/delete content and manage users |
| **Admin** | Create announcements, events, materials, and schedule items; manage users |
| **Student / User** | View all content, RSVP to events; cannot create or delete |

Admins can promote other users to admin from the **Admin** tab. The super admin account cannot be demoted.

---

## Tech Stack

- **Framework:** Expo SDK 54, React Native 0.81, React 19
- **Language:** TypeScript
- **Navigation:** React Navigation 7 (Stack + Bottom Tabs)
- **Backend:** Firebase Auth, Cloud Firestore
- **File Upload:** Cloudinary
- **Icons:** Expo Vector Icons (Ionicons)

---

## Project Structure

```
CampusConnect/
├── App.tsx                 # Root app + notification setup
├── assets/                 # Icons, splash, demo screenshots
├── src/
│   ├── components/         # Reusable UI (buttons, inputs, guards)
│   ├── config/             # App config (super admin email)
│   ├── context/            # AuthContext, AdminContext
│   ├── hooks/              # Real-time Firestore listeners
│   ├── navigation/         # Root stack + tab navigator
│   ├── screens/            # All app screens
│   ├── services/           # Firebase, admin, uploads
│   ├── theme/              # Colors, spacing, typography
│   └── utils/              # Alerts, confirm dialogs
├── app.json
├── package.json
└── .env                    # Firebase credentials (not committed)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your phone (optional, for mobile testing)
- A [Firebase](https://firebase.google.com/) project
- A [Cloudinary](https://cloudinary.com/) account (for file uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd CampusConnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Enable Firebase services**

   In the [Firebase Console](https://console.firebase.google.com/):

   - Enable **Email/Password** authentication
   - Create a **Firestore** database
   - Add a `users` collection (created automatically on first login)

5. **Configure Cloudinary**

   - Create an unsigned upload preset named `campusconnect`
   - Allow **image** and **raw** resource types for PDF/document uploads
   - Update the cloud name in `src/services/cloudinary.ts` if needed

### Run the App

```bash
# Start Expo dev server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `w` to open in the browser.

---

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | User profiles (`email`, `isAdmin`, `photoURL`, etc.) |
| `announcements` | Campus announcements |
| `events` | Events with RSVP attendee lists |
| `materials` | Study materials with file URLs |
| `schedule` | Class schedule by day of week |

---

## Admin Setup

The super admin email is configured in `src/config/admin.ts`:

```typescript
export const SUPER_ADMIN_EMAIL = 'lidiyamesenbet16@gmail.com';
```

This account is automatically granted admin rights on every login. To bootstrap a different first admin manually:

1. Sign up and log in
2. Copy your User ID from the Profile screen
3. In Firebase Console → Firestore → `users/{uid}` → set `isAdmin: true`

Or use the helper in `src/scripts/makeAdmin.ts`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in web browser |

---

## Screenshots Reference

Demo images are stored in the `assets/` folder:

| File | Screen |
|------|--------|
| `Screenshot 1.png` | Login |
| `Screenshot 2.png` | Admin Command Center |
| `Screenshot 3.png` | Announcements feed |

---

## License

This project is private and intended for educational/campus use.

---

## Author

Built as a campus connectivity platform for students and administrators.
