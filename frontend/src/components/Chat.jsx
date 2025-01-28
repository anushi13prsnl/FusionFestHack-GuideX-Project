// Chat.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chat = () => {
  const { userId } = useParams();
  const { user, isLoading } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch recipient's email when component mounts
  useEffect(() => {
    const fetchRecipientEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setRecipientEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching recipient email:', error);
      }
    };

    if (userId) {
      fetchRecipientEmail();
    }
  }, [userId]);

  // Handle user authentication and message fetching
  useEffect(() => {
    if (!user || !socket || !isConnected || !recipientEmail) return;

    // Join the user's room using email
    socket.emit('join', user.email);
    console.log('Joined room:', user.email);

    // Fetch chat messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${user.email}/${recipientEmail}`);
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    const handleReceiveMessage = (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => {
        // Check if message already exists in the array
        const messageExists = prevMessages.some((msg) => msg._id === message._id);
        if (messageExists) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [user, userId, socket, isConnected, recipientEmail]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !isConnected || !recipientEmail) return;

    const message = {
      sender: user.email,
      recipient: recipientEmail, // Use recipient's email instead of ID
      message: newMessage,
      timestamp: new Date(),
    };

    try {
      // First save to database
      const response = await axios.post('http://localhost:5000/api/chat', message);
      console.log('Message saved:', response.data);

      // Then emit through socket
      socket.emit('sendMessage', response.data);
      console.log('Message emitted:', response.data);

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
      {!isConnected && (
        <div className="text-red-500 text-center mb-4">
          Disconnected from chat server. Trying to reconnect...
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md">
        <div className="mb-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${msg.sender === user.email ? 'text-right' : 'text-left'}`}
            >
              <p
                className={`inline-block p-2 rounded ${
                  msg.sender === user.email ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {msg.message}
                <span className="block text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
