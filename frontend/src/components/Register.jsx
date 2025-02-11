import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    picture: user.picture,
    phoneNumber: '',
    areasOfExpertise: '',
    areasOfInterest: '',
    availability: '',
    experienceLevel: '',
    bio: '',
    location: '',
    linkedInProfile: '',
    gender: '',
    age: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData);
      navigate('/connect');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Register</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Areas of Expertise</label>
          <select
            name="areasOfExpertise"
            value={formData.areasOfExpertise}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
            <option value="mern">MERN</option>
            <option value="mean">MEAN</option>
            <option value="blockchain">Blockchain</option>
            <option value="alml">AI/ML</option>
            <option value="cybersecurity">Cyber Security</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Areas of Interest</label>
          <input
            type="text"
            name="areasOfInterest"
            value={formData.areasOfInterest}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Availability (Days/Time)</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Experience Level</label>
          <input
            type="text"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location (City/Region)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">LinkedIn Profile URL</label>
          <input
            type="url"
            name="linkedInProfile"
            value={formData.linkedInProfile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;