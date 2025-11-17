import { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NewsView from "./components/NewsView";
import SpiritualTracker from "./components/SpiritualTracker";
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
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);


useLayoutEffect(() => {

  const handleMessage = (event) => {
    console.log("Received message:", event.data);
    if (event.data && event.data.pluginSecretKey) {
      setPluginSecretKey(event.data.pluginSecretKey);
      if (event.data.authToken) {
        setAuthToken(event.data.authToken);
      }
      setIsAuthenticated(true);
    } 
  };

  window.addEventListener('message', handleMessage);
  

  return () => {
    window.removeEventListener('message', handleMessage);

  };
}, []);

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
    const handleAuthError = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          {/* <h1 className="text-2xl font-bold text-gray-800">
            ARK Connect
          </h1> */}
          {/* {isAuthenticated && (
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === "/" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                News
              </button>
              <button
                onClick={() => navigate("/spiritual-tracker")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === "/spiritual-tracker" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Spiritual Tracker
              </button>
            </nav>
          )} */}
        </div>

        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<NewsView />} />
            <Route path="/spiritual-tracker" element={<SpiritualTracker />} />
            <Route path="/login" element={<LoginModal open={true} onClose={() => navigate("/")} />} />
          </Routes>
        ) : (
          <UnauthenticatedMessage />
        )}
      </div>
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