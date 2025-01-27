import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const { userId } = useParams();
  const { user, isLoading } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    // Join the user's room
    socket.emit('join', user.email);

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

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [user, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: user.email,
      recipient: userId,
      message: newMessage,
    };

    try {
      const response = await axios.post('/api/chat', message);
      socket.emit('sendMessage', response.data);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Chat</h1>
      <div className="bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === user.email ? 'text-right' : 'text-left'}`}>
              <p className={`inline-block p-2 rounded ${msg.sender === user.email ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.message}
                <span className="block text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </p>
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