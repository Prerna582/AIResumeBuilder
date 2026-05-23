# AI Resume Builder

## 📌 About the Project

**AI Resume Builder** is a full-stack web application that helps users create professional, job-ready resumes quickly and easily. The platform leverages AI to enhance resume content and provides customizable templates, real-time previews, and PDF downloads.

---

## 📝 Project Description

This project is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. Users can enter their personal, educational, and professional details, choose a resume template, and generate a polished resume. AI integration helps optimize resume content, making it more effective and professional.

---

## ⚙️ How the Project Works

### 1️⃣ Backend Setup

The backend requires environment variables for proper configuration.

#### Step 1: Create `.env` File

* Navigate to the **backend** directory.
* Create a file named `.env`.
* Copy all contents from the provided `.env.example` file and paste them into the new `.env` file.

#### Step 2: Configure Environment Variables

Update the following values in the `.env` file:

* **OPENAI_API_KEY**

  * Generate an API key from **Google AI Studio (Gemini API)**
  * Paste the generated key into `OPENAI_API_KEY`

* **IMAGEKIT API Keys**

  * Create an account on **ImageKit**
  * Add your ImageKit private key

* **MONGODB_URI**

  * Create a cluster on **MongoDB Atlas**
  * Copy the connection URI and paste it into `MONGODB_URI`

#### Example:

```env
JWT_SECRET="ANY_SECRET_KEY"

CORS=*

MONGODB_URI="YOUR MONGODB_URI"
IMAGEKIT_PRIVATE_KEY="YOUR PRIVATE_KEY"
PORT=3000

OPENAI_API_KEY="YOUR GEMINI_KEY"
OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
OPENAI_MODEL = "gemini-2.5-flash"
```

---

### 2️⃣ Application Flow

1. User enters resume details through the frontend
2. Data is validated and sent to the backend
3. AI processes and optimizes resume content
4. Resume is rendered using selected templates
5. User previews and downloads the resume as a PDF

---

## 🚀 Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI Integration:** Gemini API
* **Image Storage:** ImageKit

---

## 📄 Features

* AI-powered resume content enhancement
* Multiple resume templates
* Real-time preview
* Secure authentication
* PDF download support

---
