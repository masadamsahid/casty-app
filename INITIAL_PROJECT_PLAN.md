# About This Casty App

This is casty-app, a casting platform app. In this platform users can register and login then complete their profile and then apply for castings, users also can post castings and manage them. That's the basic feature of this app. Think it like a LinkedIn but for entertainment and showbiz industry.


## Tech Stack

Below is the tech stack used in this app.

### Frontend
- Next.js
- TypeScript
- PNPM
- Tailwind CSS
- Shadcn UI
- Axios
- BetterAuth
- Zod
- React Hook Form
- For more, check on `/apps/web/package.json`

### Backend
- TypeScript
- PNPM
- Hono
- Drizzle
- PostgreSQL
- BetterAuth
- Google OAuth
- Google Cloud Storage
- Zod
- For more, check on `/apps/server/package.json`


# Coding Guidelines

General coding guidelines:
- Make sure the code is understandable yet efficient
- Using 2 spaces for indentation is really recommended

## Database Schema and Migration Guidelines

1. The database schema must be defined in the `apps/packages/src/db/schema.ts` file.
2. The database schema must be updated when a new entity is added to the database.
3. The database schema must be updated when a new field is added to an entity.
4. The database schema must be updated when a new relationship is added to an entity.
5. The database schema must be updated when a new index is added to an entity.
6. The database schema must be updated when a new trigger is added to an entity.
7. The database schema must be updated when a new constraint is added to an entity.
8. The database schema must be updated when a new function is added to an entity.
9. The database schema must be updated when a new view is added to an entity.
10. The database migrations must be defined in the `apps/packages/src/db/migrations` directory.
11. The migrations must be executed manually. AI agents are not allowed to execute migrations.


## Back End Coding Guidelines

For the backend API, we have several standards

1. The code architecture must follow the route(`apps/server/src/routes`), handler (`apps/server/src/handlers`), service (`apps/server/src/services`), repository (`apps/server/src/repositories`) pattern.
2. The REST API JSON body response must follow this general standard:

    - For successful responses:
    ```json
    {
        "success": true,
        "message": "",
        "data": {
            ... // returned data
        },
    }
    ```
    
    - For failed responses:
    ```json
    {
        "success": false,
        "error": {
            "message": "",
            "code": "",
        }
    }
    ```
    - For validation errors must be mapped into:
    ```json
    {
        "success": false,
        "error": {
            "message": "",
            "code": "",
            "errors": {
                "field_name_1": [
                    "error_message_1",
                    "error_message_2"
                ],
                "field_name_2": [
                    "error_message_1",
                    "error_message_2"
                ],
            }
        }
    }
    ```

3. Every possible error must be logged to enable easy debugging.
4. Every new and updated endpoint must be documented in the API documentation `(/apps/server/ENDPOINTS.md)`.
5. Implement DRY (Don't Repeat Yourself) principle by creating reusable services, repositories, function libs, etc.
6. Using the active records when using the ORM is preferred.

## Front End Coding Guide

For the frontend app, we must follow this standard:

1. Avoid using `"use client"` directive if it possible, especially in the `page.tsx` and `layout.tsx` files.
2. Only use `"use client"` directive if it is really necessary.
3. Implement DRY (Don't Repeat Yourself) principle by creating reusable components, hooks, functions, libs, etc.
4. Use the `page.tsx` for the main page content and `layout.tsx` for the layout. 
5. If some page has same components/layouts to render and under the same route or layout, use the `layout.tsx` if applicable. And create a component for the shared layout if needed;

## Front End UI/UX and Styling Guidelines

1. Use TailwindCSS for styling.
2. Use shadcn/ui for components.
3. Use the main layout for the main layout.
4. Use the page layout for the page layout.
5. The style should be modern, boxy, and minimalistic.


## Entities Description

In this app there are several main entities:

1. User:
    - Has a username
    - Has an email
    - Has a password (optional because we will implement two auth methods, password auth and Google OAuth2)
    - Has main avatar
    - Has a profile
    - Has a `is_talent` boolean field for flagging the user as talent. So it can apply for castings and be searched.

    - can act as talent, casting manager, or both in the same time.
    - A talent is a user who can apply for castings
    - A casting manager is a user who can post and manage castings

    - can create agencies
    - can manage agencies
    - can belong to some agencies

    - can post castings
    - can manage castings
    - can apply for castings
    - can manage applications

2. Profile
    - Belongs to a user
    - Only the owner can manage it
    - Has a full name (required)
    - Has a description (rich text support, optional)
    - Has a country of residence (optional)
    - Has a height (in cm, optional)
    - Has a weight (in Kg, optional)
    - Has a total years of experience (optional)
    - Has hair color (optional)
    - Has eye color (optional)
    - Has skin tone (optional)
    - Has a birth date (optional, date type)
    - Has a gender (optional, enum: male, female, other)
    - Has a public phone number (optional)
    - Has a public email (optional)
    - Has many gallery photos
    - Has many skills (acting, singing, content creation, comedy, public speaking, etc)
    - Has many experiences 
    - Has many educations
    - Has many portfolio/projects
    - Has many social links

3. Skill
    - Has a name
    - Has a description
    - Has many talents


2. Agency:
    - created by user (owner)
    - can have a name
    - can have a description
    - can have a logo
    - must have unique url handler/slug (Can only be alphanumeric, lowercase, and without spaces)
    - only owner can change the agency details
    - can have some users members (one owner, many admins, many talent members)
    - admin membership can be managed by the owner
    - talent membership can be managed by the owner and admins
    - can be associated to castings by the owner or admins
    - the owner and admins can apply for castings on behalf of its talent member

3. Casting Category
    - has a name
    - can be added by user when posting a casting if not yet exists

4. Casting (created by casting manager)
    - created by casting manager
    - can be independent (null) or associated to an agency (agency_id)
    - can have some applications
    - belongs to a category (e.g. film, tv, music, etc)
    - can be deleted by casting manager
    - can be updated by casting manager

    - has a title
    - has a description (rich text support)
    - has a location preference (optional)
    - has many skills preferences (optional)
    - has height preference (optional)
    - has a deadline (optional)
    - has a budget (optional)
    - has `is_cover_letter_required` (optional, boolean)
    - has a status (draft, published, closed)

5. Application (created by talent)
    - created by talent
    - can be applied for a casting
    - can be applied for a casting on behalf of an agency
    - can be shortlisted by casting manager
    - can be accepted by casting manager
    - can be rejected by casting manager
    - can be attached with a cover letter (text area)

    - can have a chat room
    - has a status (shortlisted, accepted, rejected)

6. Chat Room (No need websocket at initial)
    - belongs to an application
    - can have many messages
    - messages between applicant who applied and casting manager who posted the casting

7. Chat Message
    - belongs to a chat room
    - belongs to a user (sender)
    - has a content (text or image)
    - has a type (text or image)
    - has a timestamp



## Main Layouts
- Sticky navbar: There are page links to Home/Casty's Logo, Castings, Talents, and Agencies. Additionally on the right side, there are a dark mode toggle ("light" and "dark" only) and user button with drop down menu ("My Profile", "My Applications", "My Casting Posts", "Logout")
- Content area
- Footer (Copyright, Privacy Policy, Terms of Service, Contact Us)


## Feature List

For the detailed features, we can follow the below features:

1. Talent listing (/talents)
- can be paginated to support paginated list or infinite scroll mode
- can be searched by name
- can be filtered by multiple agencies
- can be filtered by skills
- can be filtered by country of residence
- can be filtered by gender
- can be filtered and sorted by age or birth date
- can be filtered and sorted by height
- can be filtered and sorted by weight
- can be filtered and sorted by total years of experience
- pagination, searching sorting, and filtering keys are put in the query params

2. Talent detail page (/talents/:id)
- show list of available talents
- displays the name, description, avatar, gallery photos, skills, experiences, educations, portfolio/projects, social links, height, weight, birth date, gender, public phone number, public email
- displays the agencies (if belongs to any)

3. Agency listing (/agencies)
- can be searched by name
- can be sorted by name
- can be paginated to support paginated list or infinite scroll mode
- displays the names, logos, and number of talents
- create agency feature (click create button, then the modal form opens)


4. Agency detail page (/agencies/:slug)
- displays the name, description, logo,
- displays the members (owner, admins, talents)
- displays the published castings
- update agency details feature (click update button, then the modal form opens)
- membership management feature (click on the member, then the modal form opens), where can add and remove members. Only owner and admins can do this. Admins can only manage talents. Owner can manage all members.

5. Casting listing (/castings)
- shows published castings
- can be searched by title
- can be filtered by agency, location, skills, category, budget
- can be sorted by created_at, deadline
- can be paginated to support paginated list or infinite scroll mode
- create casting feature (click create button, then the modal form opens)

6. Casting detail page (/castings/:id)
- displays the casting details
- displays the applications (only for casting poster)
- displays the chat rooms (only for casting poster)
- update casting details feature (click update button, then the modal form opens)
- close casting feature (click close button, then confirmation modal opens)

7. Application details (/applications/:id)
- displays the application details
- displays the casting details
- displays the talent details
- displays the chat room
- displays the status
- displays the cover letter

8. User & Profile page (/me)
- displays the user details
- displays the profile details
- Edit profile details feature

9. Application listing (/me/applications)
- Only applications that created by the user
- Sorted by created_at
- can be paginated to support paginated list or infinite scroll mode
- link/button to the application detail page
- link/button to the chat room

10. Casting listing (/me/castings)
- Only castings that created by the user
- can be sorted by created_at, deadline
- can be paginated to support paginated list or infinite scroll mode
- link/button to the casting detail page

11. Landing page (/)
- Display CTA
- Display some talents
- Display some agencies
- Display some castings


