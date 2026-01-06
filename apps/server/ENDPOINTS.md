# Casty App API Endpoints

Base URL: `http://localhost:3000/api` (default development)

## Authentication (Better Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/GET | `/auth/*` | Better Auth handlers (signin, signup, session, etc.) |

---

## Users

### Get My Profile
- **Method:** `GET`
- **Path:** `/users/me`
- **Auth:** Required
- **Description:** Returns the current user's details and profile.

### Update Profile
- **Method:** `PATCH`
- **Path:** `/users/profile`
- **Auth:** Required
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "bio": "Experienced actor...",
    "gender": "male",
    "skills": ["uuid-of-skill-1", "uuid-of-skill-2"],
    "heightCm": 180,
    "weightKg": 75
  }
  ```

### Update Settings
- **Method:** `PATCH`
- **Path:** `/users/settings`
- **Auth:** Required
- **Body:**
  ```json
  {
    "username": "johndoe",
    "isTalent": true
  }
  ```

---

## Agencies

### Get All Agencies
- **Method:** `GET`
- **Path:** `/agencies`
- **Auth:** Optional
- **Description:** Returns a list of all agencies.

### Get Agency by ID
- **Method:** `GET`
- **Path:** `/agencies/:id`
- **Auth:** Optional

### Create Agency
- **Method:** `POST`
- **Path:** `/agencies`
- **Auth:** Required
- **Body:**
  ```json
  {
    "name": "Global Talents",
    "description": "Leading agency in NYC",
    "website": "https://globaltalents.com"
  }
  ```

### Update Agency
- **Method:** `PATCH`
- **Path:** `/agencies/:id`
- **Auth:** Required (Admin only)

### Manage Membership
- **Method:** `POST`
- **Path:** `/agencies/:id/members`
- **Auth:** Required (Admin only)
- **Body:**
  ```json
  {
    "userId": "target-user-id",
    "action": "add",
    "role": "agent"
  }
  ```
  *Actions: `add`, `remove`*

---

## Castings

### List Castings
- **Method:** `GET`
- **Path:** `/castings`
- **Query Params:** `categoryId`, `title`, `location`
- **Description:** Filterable list of casting calls.

### Get Casting Categories
- **Method:** `GET`
- **Path:** `/castings/categories`

### Get Casting Details
- **Method:** `GET`
- **Path:** `/castings/:id`

### Create Casting Call
- **Method:** `POST`
- **Path:** `/castings`
- **Auth:** Required
- **Body:**
  ```json
  {
    "title": "Lead Actor for Sci-Fi Short",
    "description": "Looking for someone agile...",
    "location": "Jakarta",
    "categoryName": "Film",
    "skills": ["skill-id-1"]
  }
  ```

### Update Casting Call
- **Method:** `PATCH`
- **Path:** `/castings/:id`
- **Auth:** Required (Manager only)

### Delete Casting Call
- **Method:** `DELETE`
- **Path:** `/castings/:id`
- **Auth:** Required (Manager only)

---

## Applications

### My Applications
- **Method:** `GET`
- **Path:** `/applications/me`
- **Auth:** Required

### Get Application Details
- **Method:** `GET`
- **Path:** `/applications/:id`
- **Auth:** Required

### Apply to Casting
- **Method:** `POST`
- **Path:** `/applications`
- **Auth:** Required
- **Body:**
  ```json
  {
    "castingId": "uuid",
    "coverLetter": "I am perfect for this role...",
    "agencyId": "optional-agency-id"
  }
  ```

### Update Application Status
- **Method:** `PATCH`
- **Path:** `/applications/:id/status`
- **Auth:** Required (Manager only)
- **Body:**
  ```json
  {
    "status": "accepted"
  }
  ```
  *Statuses: `pending`, `accepted`, `rejected`, `interviewing`*

---

## Chat

### Get Room Messages
- **Method:** `GET`
- **Path:** `/chat/room/:roomId`
- **Auth:** Required

### Send Message
- **Method:** `POST`
- **Path:** `/chat/room/:roomId`
- **Auth:** Required
- **Body:**
  ```json
  {
    "content": "Hello, I am interested!",
    "type": "text"
  }
  ```

---

## Uploads

### Upload File
- **Method:** `POST`
- **Path:** `/upload`
- **Auth:** Required
- **Body:** `multipart/form-data`
  - `file`: (File)
  - `folder`: (String, optional, default: "general")
- **Response:**
  ```json
  {
    "success": true,
    "data": { "url": "https://storage.googleapis.com/..." }
  }
  ```
