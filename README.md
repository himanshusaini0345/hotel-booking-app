# Hotel Booking Management System

A full-stack web application designed for managing Users, Hotels, and Bookings efficiently. This project utilizes a Node.js/Express backend, interacting with a MongoDB database, and a React (Vite) frontend styled with PrimeReact components.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a valid MongoDB URI

## Project Setup

### 1. Database Configuration
1. Navigate to the `backend/` directory.
2. Rename `.env.example` to `.env`. It contains:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hotel_task
```

### 2. Backend Setup
1. From the project root, navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. (Optional) Run the database seed script to populate sample Users, Hotels, and Bookings:
```bash
node seed.js
```
4. Start the backend server:
```bash
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the Vite React app:
```bash
npm run dev
```
*(Runs on `http://localhost:5173`)*

## API Documentation Overview
| Method | Endpoint                     | Description                                         |
|--------|------------------------------|-----------------------------------------------------|
| GET    | `/api/users/getUserList`     | Fetch users (Pagination, Sort, Search filters)      |
| GET    | `/api/hotels/getHotelList`   | Fetch hotels (Pagination, Sort, Status/Loc filters) |
| GET    | `/api/state`                 | Fetch states for dropdown filters                   |
| GET    | `/api/city`                  | Fetch cities mapped by stateId                      |
| GET    | `/api/bookings/getBookings`  | Fetch populated bookings (Supports Excel download)  |
| POST   | `/api/bookings/createBooking`| Create booking (Validates 9PM rule and duplicates)  |
| POST   | `/api/bookings/:id/cancel`   | Update booking status to cancelled (1)              |

## Architectural Notes
- **React Query** handles data fetching states (Loading, Error, Refetch).
- **Reusable Filters/Tables** dynamically parse data reducing bloated pages.
- Business Logic Constraints (e.g., booking time limits, duplicate limits) rigorously tested via controllers.
