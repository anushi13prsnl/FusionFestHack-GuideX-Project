import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ user, isCurrentUser, onSendCoins }) => {
  // Ensure user has valid properties before rendering
  if (!user) {
    return null; // or a loading spinner
  }

  console.log("Card User Data: ", user); // Log the user data being passed to the card

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    tier: user.tier || 'Copper',
    coins: user.coins || 100,
  });

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

  const getTier = (coins) => {
    if (coins >= 1000) return 'Legendary';
    if (coins >= 750) return 'Diamond';
    if (coins >= 500) return 'Gold';
    if (coins >= 250) return 'Silver';
    return 'Copper';
  };

  return (
    <div className="card bg-white shadow-md rounded p-4 mb-4 relative">
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded"
            placeholder="Email"
            disabled
          />
          <input
            type="text"
            name="niche"
            value={formData.niche}
            onChange={handleChange}
            className="input mb-2 p-2 border rounded"
            placeholder="Niche"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="textarea mb-2 p-2 border rounded"
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
          {isCurrentUser && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          )}
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p>{user?.email}</p>
          <p>Tier: {getTier(user?.coins)}</p>
          <p>Coins: {user?.coins}</p>
          <p>{user?.bio}</p>
          <p>{user?.niche}</p>
          {!isCurrentUser && (
            <>
              <button
                onClick={() => onSendCoins(user?.email)}
                className="btn btn-primary bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Send Coins
              </button>
              <button className="btn btn-primary bg-green-500 text-white px-4 py-2 rounded ml-2">
                Connect
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
