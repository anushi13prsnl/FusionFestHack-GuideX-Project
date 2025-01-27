import React from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { userId } = useParams();

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Chat with User {userId}</h1>
      <div className="bg-white p-8 rounded shadow-md">
        <p>Chat functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default Chat;