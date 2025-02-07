import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Trophy, Star, Coins, Award, Timer, TrendingUp } from 'lucide-react';

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
      {
        question: 'Which property is used to change the background color?',
        options: [
          { text: 'color', isCorrect: false },
          { text: 'bgcolor', isCorrect: false },
          { text: 'background-color', isCorrect: true },
          { text: 'background', isCorrect: false },
        ],
      },
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
      }
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
      }
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
      }
    ]
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTotalCoins(100);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLeaderboard(leaderboardFilter);
  }, [leaderboardFilter]);

  const fetchLeaderboard = async (filter) => {
    try {
      const response = await axios.get(`/api/leaderboard?filter=${filter}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const startQuiz = () => {
    if (selectedArea && staticMCQs[selectedArea]) {
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
      const bonus = streak >= 5 ? 5 : 0;
      setTotalCoins(totalCoins + 10 + bonus);
    } else {
      setStreak(0);
    }

    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz completed! Your score: ${score + (isCorrect ? 1 : 0)}`);
      setQuizActive(false);
    }
  };

  const claimDailyReward = () => {
    if (!dailyRewardClaimed) {
      setTotalCoins(totalCoins + 50);
      setDailyRewardClaimed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Developer Insights</h1>
          <p className="text-xl text-gray-600">Test your knowledge, earn rewards, and climb the leaderboard</p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="text-center py-12 px-6">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Developer Insights</h2>
              <p className="text-gray-600 mb-6">Please log in to access exclusive quizzes and rewards</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Log In to Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {!quizActive ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Stats Cards */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Coins className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Coins</p>
                        <p className="text-2xl font-bold text-gray-900">{totalCoins}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Streak</p>
                        <p className="text-2xl font-bold text-gray-900">{streak}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Timer className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Daily Reward</p>
                          <p className="text-2xl font-bold text-gray-900">+50 coins</p>
                        </div>
                      </div>
                      <button
                        onClick={claimDailyReward}
                        disabled={dailyRewardClaimed}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          dailyRewardClaimed
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {dailyRewardClaimed ? 'Claimed' : 'Claim'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quiz Selection */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <h2 className="text-2xl font-bold">Select Your Challenge</h2>
                    </div>
                    <select
                      value={selectedArea}
                      onChange={handleAreaChange}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose your expertise area</option>
                      <option value="frontend">Frontend Development</option>
                      <option value="backend">Backend Development</option>
                      <option value="fullstack">Fullstack Development</option>
                      <option value="mern">MERN Stack</option>
                      <option value="mean">MEAN Stack</option>
                      <option value="blockchain">Blockchain Development</option>
                      <option value="alml">AI/ML Development</option>
                      <option value="cybersecurity">Cyber Security</option>
                    </select>
                    <button
                      onClick={startQuiz}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Start Challenge
                    </button>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h2 className="text-2xl font-bold">Leaderboard</h2>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                      {['daily', 'weekly', 'all-time'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setLeaderboardFilter(filter)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            leaderboardFilter === filter
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {leaderboard.map((user, index) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 flex items-center justify-center">
                              {index < 3 ? (
                                <Award
                                  className={`w-6 h-6 ${
                                    index === 0
                                      ? 'text-yellow-500'
                                      : index === 1
                                      ? 'text-gray-400'
                                      : 'text-orange-500'
                                  }`}
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">{index + 1}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{user.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">{user.coins}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{mcqs[currentQuestion].question}</h2>
                  <div className="space-y-4">
                    {mcqs[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.isCorrect)}
                        className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <span className="font-medium">{option.text}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between text-sm text-gray-600">
                    <span>Question {currentQuestion + 1} of {mcqs.length}</span>
                    <span>Current Score: {score}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;