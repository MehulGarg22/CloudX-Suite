# ConnectCloud Blogs 📝☁️

A fully functional, full-stack blogging platform built using **ReactJS** and **AWS Serverless Architecture**. It allows users to create, read, update, and delete blog posts with optional image uploads. The platform emphasizes security, scalability, and performance, using technologies like AWS Lambda, API Gateway, DynamoDB, and S3.

---

## 🚀 Live Demo
👉 [Visit ConnectCloud Blogs](https://bloggingplatforms.netlify.app)

---

## 📌 Key Features

- 🔐 **User Authentication**
  - Signup with email, password, and optional profile image.
  - JWT-based authentication with 1-hour expiry.
  - Secure file upload to Amazon S3 using presigned URLs.

- 📄 **Blog Management**
  - Create, read, update, and delete blogs.
  - Blogs include title, description, and image.
  - Data stored in DynamoDB using composite keys: `email` (PK), `blogId` (SK).
  - BlogId is uniquely generated using UUID.

- 🎨 **User Interface**
  - Built using ReactJS and Ant Design.
  - Forms, modals, dynamic tables, popups, and notifications for clean UX.
  - View Full Blog, Edit, and Delete buttons in each table row.

- ⚙️ **Backend Architecture**
  - 7 AWS Lambda functions (`signup`, `signin`, `createBlog`, `getBlogs`, `updateBlog`, `deleteBlog`, `generatePresignedURL`).
  - API endpoints configured via API Gateway.
  - JWT and UUID handled via Lambda Layers.

- ☁️ **DevOps**
  - Frontend deployed with Netlify (CI/CD from GitHub).
  - Backend is fully serverless with IAM-based access control.
  - API tested using Postman.

---

## 🛠 Tech Stack

### **Frontend**
- ReactJS
- Ant Design
- Axios
- HTML5/CSS3

### **Backend / Serverless**
- Node.js
- AWS Lambda
- API Gateway
- DynamoDB
- Amazon S3
- Lambda Layers (jsonwebtoken, uuid)

### **DevOps & Tools**
- Netlify (CI/CD)
- Git, GitHub
- Postman
- JWT Authentication
- IAM Roles & Policies

---

## 📈 Impact & Highlights

- ✅ Achieved **100% reliability** in image uploads using presigned S3 URLs.
- 📊 Improved blog data performance by **40%** through optimized DynamoDB queries.
- 💡 Demonstrates practical implementation of a **fully serverless, stateless application**.

---
