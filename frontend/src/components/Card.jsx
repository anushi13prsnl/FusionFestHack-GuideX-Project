import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ user, isCurrentUser, onSendCoins, onViewProfile, onConnect }) => {
  if (!user) {
    return null; // Return null or a loading spinner if user data is unavailable
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    tier: user.tier || 'Copper',
    coins: user.coins || 100,
  });
  const [anonymousMessage, setAnonymousMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/users/${user.email}`, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleAnonymousConnect = () => {
    setAnonymousMessage('Under Construction');
    setTimeout(() => setAnonymousMessage(''), 2000);
  };

  const getTier = (coins) => {
    if (coins >= 1000) return 'Legendary';
    if (coins >= 750) return 'Diamond';
    if (coins >= 500) return 'Gold';
    if (coins >= 250) return 'Silver';
    return 'Copper';
  };

  return (
    <div className="card bg-white shadow-md rounded p-4 mb-4 relative text-center">
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded w-full"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded w-full"
            placeholder="Email"
            disabled
          />
          <input
            type="text"
            name="niche"
            value={formData.niche}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded w-full"
            placeholder="Niche"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="textarea mb-2 p-2 border rounded w-full"
            placeholder="Bio"
          />
          <button
            onClick={handleSave}
            className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <img
            src={user?.picture}
            alt={`${user?.name}'s profile`}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{user?.name}</h2>
          <p className="mb-2">{user?.email}</p>
          <p className="mb-2">Tier: {getTier(user?.coins)}</p>
          <p className="mb-4">Coins: {user?.coins}</p>

          {isCurrentUser && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                onClick={() => onViewProfile(user._id)}
                className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                View Profile
              </button>
            </>
          )}

          {!isCurrentUser && (
            <>
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => onSendCoins(user?.email)}
                  className="btn btn-primary bg-green-500 text-white px-4 py-2 rounded"
                >
                  Send Coins
                </button>
                <button
                  onClick={() => onViewProfile(user._id)}
                  className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onConnect(user._id)}
                  className="btn btn-primary bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Connect
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={handleAnonymousConnect}
                  className="btn btn-primary bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Connect Anonymously
                </button>
                {anonymousMessage && (
                  <p className="text-sm text-gray-600 mt-2">{anonymousMessage}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;