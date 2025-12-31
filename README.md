# MERN Authentication App

A full-stack **User Authentication application** built using the **MERN stack**, focusing on secure authentication, scalable backend architecture, and a clean frontend file structure.

This project demonstrates real-world authentication workflows used in production-level applications.

---

## 🚀 Features

- User registration & login
- Secure authentication using **JWT (Access & Refresh Tokens)**
- Token storage using **HTTP-only cookies**
- Password hashing for security
- Protected routes
- User profile view & update
- Cloudinary integration for profile image storage
- Proper error handling and loading states
- Clean and maintainable frontend file structure

---

## 🛠 Tech Stack

### Frontend

- React.js
- Redux / Redux Toolkit
- JavaScript
- CSS / Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- JWT (Access & Refresh Tokens)
- Cloudinary

---

## 📁 Project Structure

user auth
│
├── backend/
│ |── cloudinary/
│ |── controllers/
│ |── db/
│ |── middleware/
│ |── models/
│ |── multer/
│ |── routes/
│ |── app.js
│ |── index.js
|
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── App.jsx
│ └── package.json
│
│
├── .env.example
├── .gitignore
└── README.md

---

## ▶️ Run Locally

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev




