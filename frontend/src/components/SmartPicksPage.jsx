import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const SmartPicksPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [recommendations, setRecommendations] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations();
      fetchBookmarked();
    }
  }, [isAuthenticated]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`/api/recommendations?email=${user.email}`);
      setRecommendations(response.data);
      setFilteredRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchBookmarked = async () => {
    try {
      const response = await axios.get(`/api/bookmarked?email=${user.email}`);
      setBookmarked(response.data);
    } catch (error) {
      console.error('Error fetching bookmarked recommendations:', error);
    }
  };

  const handleBookmark = async (recommendation) => {
    try {
      const response = await axios.post('/api/bookmark', {
        email: user.email,
        recommendation,
      });
      setBookmarked(response.data);
    } catch (error) {
      console.error('Error bookmarking recommendation:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = recommendations.filter((rec) =>
      rec.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Smart Picks</h1>
      <div className="mb-8 p-4 bg-white rounded shadow-md">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search recommendations..."
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((rec) => (
          <div key={rec._id} className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{rec.title}</h2>
            <p className="mb-4">{rec.description}</p>
            <button
              onClick={() => handleBookmark(rec)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {bookmarked.some((b) => b._id === rec._id) ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarked.map((rec) => (
            <div key={rec._id} className="p-4 bg-white rounded shadow-md">
              <h2 className="text-xl font-bold mb-2">{rec.title}</h2>
              <p className="mb-4">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartPicksPage;