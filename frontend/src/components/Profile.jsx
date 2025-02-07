import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Mail, MapPin, Briefcase, GraduationCap, Calendar, User, Linkedin } from "lucide-react"

const Profile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`)
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [userId])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case "gold":
        return "bg-yellow-500"
      case "silver":
        return "bg-gray-400"
      case "bronze":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">User Profile</h1>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={user.picture || "/placeholder.svg"}
              alt={user.name}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>

          <div className="pt-16 pb-8 px-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-1">
              {user.experienceLevel} {user.areasOfExpertise.split(",")[0]}
            </p>

            <div className="mt-4 flex justify-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTierColor(user.tier)}`}>
                {user.tier} Tier
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-yellow-800 bg-yellow-200">
                {user.coins} Coins
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 px-8 py-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.availability}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.experienceLevel}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.age} years old</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{user.gender}</span>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Expertise & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.areasOfExpertise.split(",").map((area, index) => (
                <span key={`expertise-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {area.trim()}
                </span>
              ))}
              {user.areasOfInterest.split(",").map((area, index) => (
                <span key={`interest-${index}`} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {area.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="px-8 py-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Bio</h3>
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>

          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Connect with {user.name}</span>
            <a
              href={user.linkedInProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Linkedin className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;