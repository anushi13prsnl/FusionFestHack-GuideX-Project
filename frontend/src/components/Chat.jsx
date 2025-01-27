import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch chat messages between the logged-in user and the selected user
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/${user.email}/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user.email, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('/api/chat', {
        sender: user.email,
        recipient: userId,
        message: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Chat</h1>
      <div className="bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === user.email ? 'text-right' : 'text-left'}`}>
              <p className="bg-gray-200 p-2 rounded">{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;