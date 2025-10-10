import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NewsView from "./components/NewsView";
import LoginModal from "./auth/login";
import { setAuthToken, setPluginSecretKey } from "./api/axiosinstance";
import { getUserToken } from "./common/constants/storage";

function UnauthenticatedMessage() {
  return (
    <div className="text-center mt-8">
      <p className="text-lg text-gray-700">
        Please authenticate via the parent application to access the news.
      </p>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for standalone login token on app load
    const checkStandaloneAuth = async () => {
      const token = await getUserToken();
      if (token) {
        setAuthToken(token);
      }
    };

    checkStandaloneAuth();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.pluginSecretKey) {
        setPluginSecretKey(event.data.pluginSecretKey);
        setIsAuthenticated(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleAuthError = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        ARK Connect News
      </h1>

        <Routes>
          <Route path="/" element={<NewsView />} />
          <Route path="/login" element={<LoginModal open={true} onClose={() => navigate("/")} />} />
        </Routes>
      {/* {isAuthenticated ? (
      ) : (
        <UnauthenticatedMessage />
      )} */}
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
