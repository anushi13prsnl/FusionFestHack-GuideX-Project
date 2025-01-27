import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-23">
      <h1 className="text-4xl font-bold text-center mb-8">{user.name}'s Profile</h1>
      <div className="bg-white p-8 rounded shadow-md">
        <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-center">{user.name}</h2>
        <p className="text-center">Email: {user.email}</p>
        <p className="text-center">Phone Number: {user.phoneNumber}</p>
        <p className="text-center">Areas of Expertise: {user.areasOfExpertise}</p>
        <p className="text-center">Areas of Interest: {user.areasOfInterest}</p>
        <p className="text-center">Availability: {user.availability}</p>
        <p className="text-center">Experience Level: {user.experienceLevel}</p>
        <p className="text-center">Bio: {user.bio}</p>
        <p className="text-center">Location: {user.location}</p>
        <p className="text-center">LinkedIn Profile: {user.linkedInProfile}</p>
        <p className="text-center">Gender: {user.gender}</p>
        <p className="text-center">Age: {user.age}</p>
        <p className="text-center">Tier: {user.tier}</p>
        <p className="text-center">Coins: {user.coins}</p>
      </div>
    </div>
  );
};

export default Profile;