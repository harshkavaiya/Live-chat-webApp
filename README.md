# Baatcheet Project - Installation Guide

**Version:** 1.0  
**Developed By:** [Harsh Kavaiya](https://www.linkedin.com/in/harsh-kavaiya/) & [Hardik Vatukiya](https://www.linkedin.com/in/hardik-vatukiya-30b53423a/)

---

## 📌 System Requirements

- **Operating System:** Windows 10/11, Linux, or macOS  
- **Software Required:**  
  - [Node.js (LTS Version)](https://nodejs.org/)  
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community)  
  - [Git (Optional)](https://git-scm.com/)  
  - [VS Code (Recommended)](https://code.visualstudio.com/)  

---

## 🔽 Clone or Download the Project

### **Option 1: Clone from GitHub**
```sh
# Clone the repository
https://github.com/harshkavaiya/Live-chat-webApp.git
cd Live-chat-webApp
```

### **Option 2: Download ZIP**
- Go to the GitHub repository.
- Click on **Download ZIP** and extract it.

---

## 📦 Install Dependencies

### **Backend (Server) Setup:**
```sh
cd server
npm install
```

### **Frontend (Client) Setup:**
```sh
cd client
npm install
```

---

## ⚙️ Configure Environment Variables

### **Backend (.env file in `server` folder)**
```env
CLOUDARY_API_KEY="199863148222589"
CLOUD_NAME="dr9twts2b"
CLOUDARY_API_SECERET="LYGyqbcjzN4LKYgqrGe1q5cPPTA"
VITE_CLIENT_HOST="http://localhost:5173"
MONGODB_URL="mongodb+srv://vatukiyahardik786:UkR8TW5NCKwIK8v9@cluster0.d8pfl.mongodb.net/real-time-chat"
JWT_SECRET="real-time-chat"
```

### **Frontend (.env file in `client` folder)**
```env
CLOUDARY_API_KEY=199863148222589
VITE_CLOUD_NAME="dr9twts2b"
CLOUDARY_API_SECERET=LYGyqbcjzN4LKYgqrGe1q5cPPTA
VITE_SERVER_HOST="http://localhost:4000"
VITE_CLIENT_HOST="http://localhost:5173"
```

---

## 🚀 Start the Project

### **Start Backend (Express.js Server):**
```sh
cd server
npm run dev
```

### **Start Frontend (React.js Application):**
```sh
cd client
npm run dev
```

Now, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✅ Testing the Application

- Register a new user.  
- Login and start a chat.  
- Try calling, sending messages, and using status updates.  

---

📌 **If you face any issues, feel free to reach out to developers** 🚀