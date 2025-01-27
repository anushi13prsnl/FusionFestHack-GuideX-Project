import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const ConnectPage = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
  const navigate = useNavigate();

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // If backend is on a different port, use the full URL, e.g., 'http://localhost:5000/api/users'
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSendCoins = async (recipientEmail) => {
    if (!user) return;
    try {
      // Send coins to another user
      await axios.post('http://localhost:5000/api/send-coins', {
        senderEmail: user.email,
        recipientEmail,
        amount: 5, // Example amount
      });
      // Show popup notification
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      // Refresh the list of users
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error sending coins:', error);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleConnect = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="container mx-auto mt-25">
      <h1 className="text-4xl font-bold text-center mb-8">Connect Page</h1>
      {!isAuthenticated ? (
        <div className="text-center">
          <p className="mb-4">Please log in to access the Connect Page.</p>
          <button onClick={() => loginWithRedirect()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Log In
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="bg-white p-4 rounded shadow-md">
                {u.picture && (
                  <img src={u.picture} alt={u.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                )}
                <h2 className="text-xl font-bold text-center">{u.name}</h2>
                <p className="text-center">Tier: {u.tier}</p>
                <p className="text-center">Coins: {u.coins}</p>
                <div className="flex justify-around mt-4">
                  <button onClick={() => handleViewProfile(u._id)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    View Full Profile
                  </button>
                  {u.email !== user.email && (
                    <>
                      <button onClick={() => handleConnect(u._id)} className="bg-green-500 text-white px-4 py-2 rounded">
                        Connect
                      </button>
                      <button onClick={() => handleSendCoins(u.email)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                        Send Coins
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          Coins transferred successfully!
        </div>
      )}
    </div>
  );
};

export default ConnectPage;