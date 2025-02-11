import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, User } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams();
  const { user, isLoading } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

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

  useEffect(() => {
    if (!user || !socket || !recipientEmail) return;

    socket.emit('join', user.email);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${user.email}/${recipientEmail}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => msg._id === message._id);
        return messageExists ? prevMessages : [...prevMessages, message];
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [user, userId, socket, recipientEmail]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !recipientEmail) return;

    const message = {
      sender: user.email,
      recipient: recipientEmail,
      message: newMessage,
      timestamp: new Date(),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/chat', message);
      socket.emit('sendMessage', response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <div className="max-w-3xl w-full px-4">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{recipientEmail}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white shadow-sm h-[calc(100vh-20rem)] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === user.email ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] break-words ${
                    msg.sender === user.email
                      ? 'bg-blue-500 text-white rounded-l-xl rounded-tr-xl'
                      : 'bg-gray-100 text-gray-900 rounded-r-xl rounded-tl-xl'
                  } p-3 shadow-sm`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.sender === user.email ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-xl shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;