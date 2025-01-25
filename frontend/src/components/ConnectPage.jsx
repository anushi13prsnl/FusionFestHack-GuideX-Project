import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './style.css';
import { useAuth0 } from '@auth0/auth0-react';

const ConnectPage = () => {
  const [users, setUsers] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        console.log("Fetched Users: ", response.data); // Log the fetched users data
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
      await axios.post('/api/send-coins', {
        senderEmail: user.email,
        recipientEmail,
        amount: 10, // Example amount
      });
      // Refresh user data
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error sending coins:', error);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Connect Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((u) => (
            <Card
              key={u.email}
              user={u}
              isCurrentUser={isAuthenticated && u.email === user?.email}
              onSendCoins={handleSendCoins}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
