//  App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

export default function App() {
  // Проверяем наличие токена в localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/*  Если токена нет — показываем Login */}
        <Route path="/login" element={<Login />} />

        {/*  Страница чата доступна только авторизованным */}
        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />

        {/*  По умолчанию переходим в /chat */}
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}
