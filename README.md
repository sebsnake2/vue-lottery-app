# Vue Lottery App

Laboratory work for the **Client Web Systems** course.

The project is built with Vue 3, TypeScript and Composition API and demonstrates routing, reusable components, repository pattern, REST API integration, authentication, Pinia state management, form validation and protected routes.

## Technologies

- Vue 3
- TypeScript
- Composition API
- Vue Router
- Pinia
- VeeValidate
- Yup
- SCSS
- Bootstrap
- Vite
- ESLint
- DummyJSON REST API

## Features

### Routing

The application uses Vue Router and includes:

- Home page
- About page
- Users page
- Login page
- 404 page
- Dynamic user route `/users/:id`
- Nested user edit route `/users/:id/edit`
- User creation route `/users/new`
- Lazy-loaded route components
- Active navigation links
- Page titles using route `meta`
- Protected routes using navigation guards
- Separate default and authentication layouts

## Users

User data is loaded from DummyJSON through a repository/service layer.

Implemented functionality:

- Users table
- User avatars
- Search by name
- 300 ms search debounce
- Pagination using `limit` and `skip`
- Search and page state stored in URL query parameters
- User details page
- User creation
- User editing
- User deletion
- Local state updates after simulated DummyJSON mutations

Because DummyJSON simulates POST, PUT and DELETE requests without permanently changing server data, created, edited and deleted users are updated locally in Pinia state.

## Repository Pattern

API access is separated from Vue components.

The project contains:

- generic `Readable<T>` interface
- generic `Creatable<T, TCreate>` interface
- generic `Editable<T, TUpdate>` interface
- `Deletable` interface
- `UserService`
- `AuthService`
- `ServiceProvider`
- reusable HTTP client

Components do not call `fetch()` directly.

## Authentication

Authentication is implemented using DummyJSON authentication endpoints.

Features:

- Login through `/auth/login`
- Current user loading through `/auth/me`
- `accessToken`
- `refreshToken`
- Tokens stored in Pinia and `localStorage`
- Authenticated user stored in Pinia and `localStorage`
- `Authorization: Bearer <token>` header
- Automatic token refresh through `/auth/refresh` after HTTP 401
- Automatic retry of the original request after successful refresh
- Protected `/users` routes
- Redirect back to the requested page after login
- Logout
- Authenticated users are redirected away from `/login`

## Forms and Validation

User create/edit and login forms use VeeValidate with Yup.

Validation includes:

- required fields
- valid email
- minimum password length
- numeric age validation
- validation messages displayed directly in the form

User form fields:

- First name
- Last name
- Email
- Username
- Password
- Age
- Gender
- Phone

## Environment Variables

The API URL is stored in an environment variable:

```env
VITE_API_URL=https://dummyjson.com

Create a local .env file based on:
.env.example

The real .env file is ignored by Git.
Project Structure
src/
├── api/
│   └── http-client.ts
├── assets/
├── components/
├── layouts/
├── router/
│   └── index.ts
├── services/
│   ├── auth.service.ts
│   ├── interfaces.ts
│   ├── service-provider.ts
│   └── user.service.ts
├── stores/
│   ├── auth.ts
│   └── users.ts
├── types/
├── views/
├── App.vue
└── main.ts

Installation
Install dependencies:
npm install

Create .env in the project root:
VITE_API_URL=https://dummyjson.com

Run the development server:
npm run dev

Code Quality
Run ESLint:
npm run lint

Create a production build:
npm run build

Preview the production build:
npm run preview

Test Account
DummyJSON test account:
Username: emilys
Password: emilyspass

Author
Sebastian Burla
GitHub: sebsnake2