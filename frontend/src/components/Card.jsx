import React, { useState } from 'react';
import axios from 'axios';

const Card = ({ user, isCurrentUser, onSendCoins, onViewProfile, onConnect }) => {
  if (!user) {
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    tier: user.tier || 'Copper',
    coins: user.coins || 100,
  });
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);
  const [anonymousMessage, setAnonymousMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

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
    setShowAnonymousModal(true);
  };

  const handleSendAnonymousMessage = async () => {
    if (!anonymousMessage.trim()) {
      setStatusMessage('Please enter a message');
      return;
    }

    try {
      await axios.post('/api/chat', {
        sender: 'anonymous', // We'll store the real sender in the backend
        recipient: user.email,
        message: anonymousMessage,
        isAnonymous: true
      });

      setAnonymousMessage('');
      setShowAnonymousModal(false);
      setStatusMessage('Message sent anonymously!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error sending anonymous message:', error);
      setStatusMessage('Failed to send message');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const getTier = (coins) => {
    if (coins >= 1000) return 'Legendary';
    if (coins >= 750) return 'Diamond';
    if (coins >= 500) return 'Gold';
    if (coins >= 250) return 'Silver';
    return 'Copper';
  };

  const AnonymousMessageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Send Anonymous Message</h3>
        <textarea
          value={anonymousMessage}
          onChange={(e) => setAnonymousMessage(e.target.value)}
          className="w-full p-2 border rounded mb-4 min-h-[100px]"
          placeholder="Type your message here..."
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowAnonymousModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSendAnonymousMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card bg-white shadow-md rounded p-4 mb-4 relative text-center">
      {showAnonymousModal && <AnonymousMessageModal />}
      {statusMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {statusMessage}
        </div>
      )}
      
      {/* Rest of your existing card content */}
      {isEditing ? (
        // Your existing editing form
        <div>{/* ... */}</div>
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
                  className="btn btn-primary bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Message Anonymously
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;