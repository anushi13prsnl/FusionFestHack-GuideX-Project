import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

function Navbar() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for logged-in user on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  // Store logged-in user in localStorage and database
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkUser = async () => {
        try {
          const response = await axios.get(`/api/users/${user.email}`);
          if (response.data) {
            setLoggedInUser(response.data);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data));
          } else {
            navigate('/register');
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            navigate('/register');
          } else {
            console.error('Error checking user:', error);
          }
        }
      };
      checkUser();
    }
  }, [isAuthenticated, user, navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Remove user from localStorage
    setLoggedInUser(null); // Reset state
    logout({ returnTo: window.location.origin }); // Auth0 logout
  };

  return (
    <nav className="bg-black p-4 fixed top-0 left-0 w-full z-50 shadow-lg shadow-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-white text-xl font-bold">GuideX</div>
          <div className="flex gap-4">
            <Link to="/" className="text-white hover:text-blue-500">Home</Link>
            <Link to="/connect" className="text-white hover:text-blue-500">Connect</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {loggedInUser ? (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowPopup(true)}
              onMouseLeave={() => setShowPopup(false)}
            >
              <img
                src={loggedInUser.picture}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
              />
              {showPopup && (
                <div className="absolute top-12 right-0 bg-gray-800 text-white p-2 rounded shadow-lg">
                  <p>{loggedInUser.name}</p>
                  <p>{loggedInUser.email}</p>
                </div>
              )}
              <button onClick={handleLogout} className="bg-transparent border-2 border-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-500 hover:text-black transition duration-300">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => loginWithRedirect()} className="bg-transparent border-2 border-blue-500 text-white px-4 py-2 rounded hover:bg-blue-500 hover:text-black transition duration-300">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;