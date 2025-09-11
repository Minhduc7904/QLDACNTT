# React Frontend Project

Một dự án React.js hiện đại được xây dựng với TypeScript, Tailwind CSS, Redux Toolkit và Axios theo kiểu clean architecture.

## 🚀 Tính năng

- ⚡ **React 18** với TypeScript support
- 🎨 **Tailwind CSS** cho styling
- 🔄 **Redux Toolkit** cho state management
- 🌐 **Axios** cho API calls
- 🛡️ **JWT Authentication**
- 📱 **Responsive Design**
- 🧩 **Component-based Architecture**
- 🔧 **Clean Code Structure**

## 📁 Cấu trúc dự án

```
src/
├── components/          # Reusable components
│   └── common/         # Common UI components
├── pages/              # Page components
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── services/           # API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants
└── App.tsx            # Main App component
```

## 🛠️ Cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình environment variables:**
   Cập nhật `REACT_APP_API_URL` trong file `.env`

3. **Khởi chạy development server:**
   ```bash
   npm start
   ```

## 📦 Scripts

- `npm start` - Khởi chạy development server
- `npm run build` - Build production
- `npm test` - Chạy tests
- `npm run eject` - Eject từ Create React App

## 🏗️ Architecture

### Clean Architecture Layers

1. **Presentation Layer** (`pages/`, `components/`)
   - React components, UI logic, User interactions

2. **Application Layer** (`hooks/`, `store/`)
   - Custom hooks, Redux store, Application state

3. **Domain Layer** (`types/`, `constants/`)
   - Business logic, Type definitions, Constants

4. **Infrastructure Layer** (`services/`, `utils/`)
   - API calls, External services, Utilities

## 🎨 Styling với Tailwind CSS

- Utility-first approach
- Responsive design
- Custom theme configuration
- Component classes trong `@layer components`

## 🔐 Authentication

JWT-based authentication với:
- Login/Register flows
- Protected routes
- Token refresh
- Persistent sessions

**Happy Coding! 🎉**
