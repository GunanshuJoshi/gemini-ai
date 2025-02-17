# Gemini AI 🧠✨  

A **MERN-based AI-powered application** that replicates **Google’s Gemini AI** with an **image recognition feature**. It provides **intelligent text and image processing** with **secure authentication** using **Clerk** and **seamless image handling** with **ImageKit**.  

🚀 **This is a free-to-use app!** Feel free to explore and enhance it.  

---

## 🌟 Features  

- 🤖 **AI-Powered Text & Image Recognition** – Uses **Google’s Generative AI** for smart responses.  
- 🔐 **Authentication** – Secure user login with **Clerk**.  
- 🖼️ **Image Handling** – Image uploads & transformations via **ImageKit**.  
- 🎨 **Beautiful UI** – Built with **React, Tailwind CSS, and React Query** for a smooth experience.  
- ⚡ **Fast Performance** – Powered by **Vite** for a blazing-fast development environment.  
- 🌐 **REST API Backend** – Built with **Express & MongoDB**, providing scalable data storage.  

---

## 🛠️ Tech Stack  

### **Frontend (client/)**  
- **React** – Component-based UI  
- **Tailwind CSS** – Styling  
- **React Query** – State management  
- **React Router** – Navigation  
- **Clerk** – Authentication  
- **ImageKit** – Image handling  
- **Google Generative AI** – AI capabilities  

### **Backend (backend/)**  
- **Express.js** – Server framework  
- **MongoDB** – Database  
- **Mongoose** – ODM for MongoDB  
- **Clerk (Express SDK)** – Secure authentication  
- **ImageKit** – Image storage and processing  
- **Dotenv** – Environment variables  
- **CORS** – Cross-origin requests handling  

---

## 🚀 Getting Started  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/GunanshuJoshi/gemini-ai.git
cd gemini-ai
```

### **2️⃣ Install Dependencies**  
#### **Frontend**
```sh
cd client
npm install
```
#### **Backend**
```sh
cd backend
npm install
```

### **3️⃣ Setup Environment Variables**  
Create `.env` files for both **backend/** and **client/** following the given structure:  

#### **Backend (`backend/.env`)**
```
PORT=your_backend_server_port
IMAGE_KIT_API_ENDPOINT=your_imagekit_api_endpoint_key
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
CLIENT_URL=your_client_url_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGO_DB_URL=your_mongo_db_url_key
```

#### **Frontend (`client/.env`)**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_API_ENDPOINT=your_imagekit_api_endpoint_key
VITE_IMAGE_KIT_KEY=your_imagekit_key
VITE_BACKEND_URL=your_backend_url_key
VITE_GEMINI_PUBLIC_KEY=your_gemini_public_key
```

### **4️⃣ Run the Application**  

#### **Start Backend**
```sh
cd backend
npm run dev
```

#### **Start Frontend**
```sh
cd client
npm run dev
```

Open your browser and go to `http://localhost:5173/`. 🎉  

---

## 📂 Project Structure  

```
gemini-ai/
│── backend/          # Express.js Backend
│   ├── models/       # Mongoose Models
│   ├── controllers/  # Business Logic
│   ├── .env          # Backend Environment Variables
│   ├── index.js      # Server Entry Point
│── client/           # React Frontend
│   ├── src/
│   ├── public/
│   ├── .env          # Frontend Environment Variables
│   ├── vite.config.js
│── package.json      # Project Metadata
│── README.md         # Project Documentation
```

---

## 📜 License  
This project is **free to use**.

---
