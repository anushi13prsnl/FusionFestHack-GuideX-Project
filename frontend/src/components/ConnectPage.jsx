// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from './Card';
// import './style.css';
// import { useAuth0 } from '@auth0/auth0-react';

// const ConnectPage = () => {
//   const [users, setUsers] = useState([]);
//   const { user, isAuthenticated } = useAuth0();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('/api/users');
//         console.log("Fetched Users: ", response.data); // Log the fetched users data
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleSendCoins = async (recipientEmail) => {
//     if (!user) return;
//     try {
//       await axios.post('/api/send-coins', {
//         senderEmail: user.email,
//         recipientEmail,
//         amount: 10, // Example amount
//       });
//       // Refresh user data
//       const response = await axios.get('/api/users');
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error sending coins:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto mt-16">
//       <h1 className="text-4xl font-bold text-center mb-8">Connect Page</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {users.length === 0 ? (
//           <p>No users found</p>
//         ) : (
//           users.map((u) => (
//             <Card
//               key={u.email}
//               user={u}
//               isCurrentUser={isAuthenticated && u.email === user?.email}
//               onSendCoins={handleSendCoins}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConnectPage;



//_________________________________________________________________________________________

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const ConnectPage = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState([]);
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
        amount: 10, // Example amount
      });
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
            users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded shadow-md">
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                )}
                <h2 className="text-xl font-bold text-center">{user.name}</h2>
                <p className="text-center">Tier: {user.tier}</p>
                <p className="text-center">Coins: {user.coins}</p>
                <div className="flex justify-around mt-4">
                  <button onClick={() => handleViewProfile(user._id)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    View Full Profile
                  </button>
                  <button onClick={() => handleConnect(user._id)} className="bg-green-500 text-white px-4 py-2 rounded">
                    Connect
                  </button>
                  <button onClick={() => handleSendCoins(user.email)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Send Coins
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectPage;
