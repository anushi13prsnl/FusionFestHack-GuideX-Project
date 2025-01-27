import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ConnectPage from './components/ConnectPage';
import Register from './components/Register';
import Profile from './components/Profile';
import Chat from './components/Chat';
// import './App.css';

function App() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;