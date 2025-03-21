## Models to Create

- **User Model**
- **Club Model**
- **Task Model**
- **Leaderboard Model**
- **Document Model**
- **Event Model**
- **Event Registration Model**
- **Chat Model**
- **Resource Model**
- **Credit Model**

---

## Controllers

### User Controllers
- `getMe` → Returns the currently logged-in user
- `getUserById` → Takes `id` from params and returns user
- `updateUser` → Takes `id` from params, matches it with `user._id`, and returns updated user
- `deleteUser` → Soft delete user (Admin only)
- `getAllUsers` → Returns a paginated list of users (Admin/Super Admin only)
- `changeRole` → Update user role (Super Admin only)
- `getUserByEmail` → Find user by email
- `addMembers` → Array of emails of members and respective club (Adds clubId to user and changes role)
- `makeAdmin` → Promote user to club admin
- `makeSubAdmin` → Promote user to sub-admin

### Club Controllers
- `createClub` → Club Admin can create a club
- `updateClub` → Modify club details
- `deleteClub` → Delete a club (Super Admin only)
- `getClubById` → Get details of a club
- `getAllClubs` → List all clubs
- `getClubMembers` → Get list of members in a club

### Task Controllers
- `createTask` → Any user can create a task (Includes file uploads in v2)
- `getTaskById` → Fetch task details by `id`
- `updateTask` → Update task details
- `deleteTask` → Delete a task (Admins only)
- `assignTask` → Assign a task to a user
- `submitTask` → Task assignee submits the task (Validation may apply)
- `reviewTask` → Assignee reviews the submission
  - If accepted → Points are added
  - If rejected → Task is reassigned

### Leaderboard Controllers
- `getLeaderboard` → Fetch overall leaderboard
- `getClubLeaderboard` → Fetch leaderboard for a specific club
- `updateLeaderboard` → Update leaderboard rankings

### Document Controllers
- `createDocument` → Create a document in a club
- `getDocumentById` → Fetch document by `id`
- `updateDocument` → Modify document content
- `deleteDocument` → Remove document

### Event Controllers
- `createEvent` → Create an event for a club
- `updateEvent` → Update event details
- `deleteEvent` → Remove an event (Admin only)
- `getEventById` → Fetch event details
- `getAllEvents` → List all events

### Event Registration Controllers
- `registerForEvent` → User registers for an event
- `getEventRegistrations` → List all registered users for an event
- `markAttendance` → Mark a user as checked-in for an event

### Chat Controllers
- `sendMessage` → User sends a message in a club chat
- `getMessages` → Fetch messages from a club chat

### Resource Controllers
- `createResource` → Add a new resource to a club
- `updateResource` → Modify resource details
- `deleteResource` → Remove a resource
- `getResources` → List available resources
- `allocateResource` → Assign a resource to a user

### Credit Controllers
- `addCredit` → Add points to a user for tasks, events, or contributions
- `getUserCredits` → Fetch a user’s credit history
- `getClubCredits` → Fetch credit records for a club

---

## Features Summary
- **User Management** → Role-based access control, club-based memberships
- **Task Management** → Task assignments, submissions, reviews, and points allocation
- **Event Management** → Event creation, registration, and attendance tracking
- **Leaderboard System** → User and club-based rankings
- **Chat System** → Club-based messaging system
- **Resource Management** → Document and asset allocation
- **Credits System** → Reward-based contributions and engagement tracking

---

This document serves as a roadmap for the development of `Bolt AI` with a structured API and feature set. 🚀

