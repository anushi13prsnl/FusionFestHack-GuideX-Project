import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"
import Card from "./Card"
import { Search, Filter } from "lucide-react"

const ConnectPage = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [filters, setFilters] = useState({
    tier: "",
    areasOfExpertise: "",
    experienceLevel: "",
    linkedInProfile: false,
    linkedInUsername: "",
    name: "",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("${process.env.REACT_APP_BACKEND_URL}/api/users")
        setUsers(response.data)
        setFilteredUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const handleSendCoins = async (recipientEmail) => {
    if (!user) return
    try {
      await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/send-coins", {
        senderEmail: user.email,
        recipientEmail,
        amount: 5,
      })
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
      const response = await axios.get("${process.env.REACT_APP_BACKEND_URL}/api/users")
      setUsers(response.data)
      applyFilters(response.data)
    } catch (error) {
      console.error("Error sending coins:", error)
    }
  }

  const handleViewProfile = (userId) => navigate(`/profile/${userId}`)
  const handleConnect = (userId) => navigate(`/chat/${userId}`)

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const applyFilters = (users) => {
    let filtered = users

    if (filters.tier) {
      filtered = filtered.filter((user) => user.tier === filters.tier)
    }
    if (filters.areasOfExpertise) {
      filtered = filtered.filter((user) => user.areasOfExpertise.includes(filters.areasOfExpertise))
    }
    if (filters.experienceLevel) {
      const experienceLevel = Number.parseInt(filters.experienceLevel, 10)
      filtered = filtered.filter((user) => Number.parseInt(user.experienceLevel, 10) >= experienceLevel)
    }
    if (filters.linkedInProfile) {
      filtered = filtered.filter((user) => user.linkedInProfile)
    }
    if (filters.linkedInUsername) {
      filtered = filtered.filter((user) => user.linkedInProfile.includes(filters.linkedInUsername))
    }
    if (filters.name) {
      filtered = filtered.filter((user) => user.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    applyFilters(users)
  }, [filters, users])

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-900">Welcome</h1>
          <p className="text-center text-gray-600">Please log in to access the Connect Page</p>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto space-y-12">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 pt-6">Discover and Connect with Experts</h1>
          <p className="text-xl text-gray-600">Find the right professional to help you achieve your goals</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Filter Experts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tier</label>
              <select
                name="tier"
                value={filters.tier}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Copper">Copper</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="1">&gt;= 1 year</option>
                <option value="5">&gt;= 5 years</option>
                <option value="10">&gt;= 10 years</option>
                <option value="15">&gt;= 15 years</option>
                <option value="25">&gt;= 25 years</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
              <input
                type="text"
                name="areasOfExpertise"
                placeholder="Enter expertise"
                value={filters.areasOfExpertise}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  placeholder="Search by name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">LinkedIn Username</label>
              <input
                type="text"
                name="linkedInUsername"
                placeholder="Enter username"
                value={filters.linkedInUsername}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="linkedin"
                name="linkedInProfile"
                checked={filters.linkedInProfile}
                onChange={handleFilterChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                Has LinkedIn Profile
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-700 text-center">
              <p className="text-lg font-semibold">No experts found matching your criteria.</p>
              <p className="mt-2">Try adjusting your filters or broadening your search.</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <Card
                key={u._id}
                user={u}
                isCurrentUser={u.email === user.email}
                onSendCoins={handleSendCoins}
                onViewProfile={handleViewProfile}
                onConnect={handleConnect}
              />
            ))
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed bottom-4 right-4 transform transition-all duration-300 ease-in-out">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">Coins transferred successfully!</div>
        </div>
      )}
    </div>
  )
}

export default ConnectPage;