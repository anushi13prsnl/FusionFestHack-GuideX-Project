import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Card from './Card'; // Import the Card component

const ConnectPage = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
  const [filters, setFilters] = useState({
    tier: '',
    areasOfExpertise: '',
    experienceLevel: '',
    linkedInProfile: false,
    linkedInUsername: '',
    name: '',
  });
  const navigate = useNavigate();

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // If backend is on a different port, use the full URL, e.g., 'http://localhost:5000/api/users'
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
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
      applyFilters(response.data);
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

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const applyFilters = (users) => {
    let filtered = users;

    if (filters.tier) {
      filtered = filtered.filter((user) => user.tier === filters.tier);
    }

    if (filters.areasOfExpertise) {
      filtered = filtered.filter((user) => user.areasOfExpertise.includes(filters.areasOfExpertise));
    }

    if (filters.experienceLevel) {
      const experienceLevel = parseInt(filters.experienceLevel, 10);
      filtered = filtered.filter((user) => parseInt(user.experienceLevel, 10) >= experienceLevel);
    }

    if (filters.linkedInProfile) {
      filtered = filtered.filter((user) => user.linkedInProfile);
    }

    if (filters.linkedInUsername) {
      filtered = filtered.filter((user) => user.linkedInProfile.includes(filters.linkedInUsername));
    }

    if (filters.name) {
      filtered = filtered.filter((user) => user.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilters(users);
  }, [filters, users]);

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
        <>
          <div className="mb-8 p-4 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Tier</label>
                <select name="tier" value={filters.tier} onChange={handleFilterChange} className="w-full p-2 border rounded">
                  <option value="">All</option>
                  <option value="Copper">Copper</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Areas of Expertise</label>
                <input
                  type="text"
                  name="areasOfExpertise"
                  value={filters.areasOfExpertise}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter areas of expertise"
                />
              </div>
              <div>
                <label className="block mb-2">Experience Level</label>
                <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="w-full p-2 border rounded">
                  <option value="">All</option>
                  <option value="1">&gt;= 1 year</option>
                  <option value="5">&gt;= 5 years</option>
                  <option value="10">&gt;= 10 years</option>
                  <option value="15">&gt;= 15 years</option>
                  <option value="25">&gt;= 25 years</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">LinkedIn Profile</label>
                <input
                  type="checkbox"
                  name="linkedInProfile"
                  checked={filters.linkedInProfile}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <span>Has LinkedIn Profile</span>
              </div>
              <div>
                <label className="block mb-2">LinkedIn Username</label>
                <input
                  type="text"
                  name="linkedInUsername"
                  value={filters.linkedInUsername}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter LinkedIn username"
                />
              </div>
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              filteredUsers.map((u) => (
                <Card
                  key={u._id}
                  user={u}
                  isCurrentUser={u.email === user.email}
                  onSendCoins={handleSendCoins}
                  onViewProfile={handleViewProfile}
                  onConnect={handleConnect}
                />
              ))
            )}
          </div>
        </>
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