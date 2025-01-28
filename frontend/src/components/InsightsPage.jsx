import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const InsightsPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [selectedArea, setSelectedArea] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState('all-time');
  const [quizActive, setQuizActive] = useState(false);

  const staticMCQs = {
    frontend: [
      {
        question: 'What does CSS stand for?',
        options: [
          { text: 'Cascading Style Sheets', isCorrect: true },
          { text: 'Colorful Style Sheets', isCorrect: false },
          { text: 'Creative Style Sheets', isCorrect: false },
          { text: 'Computer Style Sheets', isCorrect: false },
        ],
      },
      // Add more frontend questions here
    ],
    backend: [
      {
        question: 'Which of the following is a backend language?',
        options: [
          { text: 'HTML', isCorrect: false },
          { text: 'CSS', isCorrect: false },
          { text: 'JavaScript', isCorrect: false },
          { text: 'Node.js', isCorrect: true },
        ],
      },
      // Add more backend questions here
    ],
    mern: [
      {
        question: 'What does MERN stand for?',
        options: [
          { text: 'MongoDB, Express, React, Node', isCorrect: true },
          { text: 'MySQL, Express, React, Node', isCorrect: false },
          { text: 'MongoDB, Express, Redux, Node', isCorrect: false },
          { text: 'MongoDB, Express, React, Next', isCorrect: false },
        ],
      },
      // Add more MERN questions here
    ],
    alml: [
      {
        question: 'What is the full form of AI?',
        options: [
          { text: 'Artificial Intelligence', isCorrect: true },
          { text: 'Automated Intelligence', isCorrect: false },
          { text: 'Automatic Intelligence', isCorrect: false },
          { text: 'Autonomous Intelligence', isCorrect: false },
        ],
      },
      // Add more AI/ML questions here
    ],
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user coins from backend (static for now)
      setTotalCoins(100); // Example static value
    }
  }, [isAuthenticated]);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const startQuiz = () => {
    if (selectedArea) {
      setMcqs(staticMCQs[selectedArea]);
      setCurrentQuestion(0);
      setScore(0);
      setStreak(0);
      setQuizActive(true);
    } else {
      alert('Please select an area of expertise.');
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      const newCoins = totalCoins + 10 + (streak >= 5 ? 5 : 0); // Bonus for streaks
      setTotalCoins(newCoins);
    } else {
      setStreak(0);
    }

    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completed! Your score: ${score + (isCorrect ? 1 : 0)}`);
      setQuizActive(false); // Reset quiz state
    }
  };

  const claimDailyReward = () => {
    if (!dailyRewardClaimed) {
      const newCoins = totalCoins + 50; // Daily reward
      setTotalCoins(newCoins);
      setDailyRewardClaimed(true);
    }
  };

  const fetchLeaderboard = async (filter) => {
    try {
      const response = await axios.get(`/api/leaderboard?filter=${filter}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard(leaderboardFilter);
  }, [leaderboardFilter]);

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">Insights Page</h1>
      {!isAuthenticated ? (
        <div className="text-center">
          <p className="mb-4">Please log in to access the Insights Page.</p>
        </div>
      ) : (
        <>
          {!quizActive ? (
            <>
              <div className="mb-8 p-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Select Your Area of Expertise</h2>
                <select
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an area</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="mern">MERN</option>
                  <option value="mean">MEAN</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="alml">AI/ML</option>
                  <option value="cybersecurity">Cyber Security</option>
                </select>
                <button
                  onClick={startQuiz}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                  Answer and Earn
                </button>
              </div>

              <div className="mb-8 p-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Progress Tracker</h2>
                <p>Total Coins Earned: {totalCoins}</p>
                <p>Current Streak: {streak}</p>
                <button
                  onClick={claimDailyReward}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={dailyRewardClaimed}
                >
                  {dailyRewardClaimed ? 'Daily Reward Claimed' : 'Claim Daily Reward'}
                </button>
              </div>

              <div className="mb-8 p-4 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => setLeaderboardFilter('daily')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setLeaderboardFilter('weekly')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setLeaderboardFilter('all-time')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                  >
                    All-Time
                  </button>
                </div>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Rank</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, index) => (
                      <tr key={user._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{user.name}</td>
                        <td className="border px-4 py-2">{user.coins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mb-8 p-4 bg-white rounded shadow-md">
              <h2 className="text-2xl font-bold mb-4">Quiz</h2>
              <p className="mb-4">{mcqs[currentQuestion].question}</p>
              {mcqs[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.isCorrect)}
                  className="block w-full p-2 mb-2 border rounded"
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InsightsPage;