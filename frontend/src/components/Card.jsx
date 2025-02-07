import React, { useState } from "react"
import axios from "axios"
import { Crown, Gem, Award, Medal, Trophy, Send, UserRound, MessageCircle, Coins } from "lucide-react"

const Card = ({ user, isCurrentUser, onSendCoins, onViewProfile, onConnect }) => {
  if (!user) return null

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    ...user,
    tier: user.tier || "Copper",
    coins: user.coins || 100,
  })
  const [showAnonymousModal, setShowAnonymousModal] = useState(false)
  const [anonymousMessage, setAnonymousMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    try {
      await axios.put(`/api/users/${user.email}`, formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const handleAnonymousConnect = () => {
    setShowAnonymousModal(true)
  }

  const handleSendAnonymousMessage = async () => {
    if (!anonymousMessage.trim()) {
      setStatusMessage("Please enter a message")
      return
    }

    try {
      await axios.post("/api/chat", {
        sender: "anonymous",
        recipient: user.email,
        message: anonymousMessage,
        isAnonymous: true,
      })

      setAnonymousMessage("")
      setShowAnonymousModal(false)
      setStatusMessage("Message sent anonymously!")
      setTimeout(() => setStatusMessage(""), 3000)
    } catch (error) {
      console.error("Error sending anonymous message:", error)
      setStatusMessage("Failed to send message")
      setTimeout(() => setStatusMessage(""), 3000)
    }
  }

  const getTier = (coins) => {
    if (coins >= 1000) return "Legendary"
    if (coins >= 750) return "Diamond"
    if (coins >= 500) return "Gold"
    if (coins >= 250) return "Silver"
    return "Copper"
  }

  const getTierIcon = (tier) => {
    const icons = {
      Legendary: Crown,
      Diamond: Gem,
      Gold: Trophy,
      Silver: Medal,
      Copper: Award,
    }
    const Icon = icons[tier] || Award
    return <Icon className="w-4 h-4" />
  }

  const getTierStyles = (tier) => {
    const styles = {
      Legendary: {
        border: "border-purple-200",
        text: "text-purple-600",
        icon: "text-purple-500",
        button: "bg-purple-500 hover:bg-purple-600",
      },
      Diamond: {
        border: "border-blue-200",
        text: "text-blue-600",
        icon: "text-blue-500",
        button: "bg-blue-500 hover:bg-blue-600",
      },
      Gold: {
        border: "border-amber-200",
        text: "text-amber-600",
        icon: "text-amber-500",
        button: "bg-amber-500 hover:bg-amber-600",
      },
      Silver: {
        border: "border-gray-200",
        text: "text-gray-600",
        icon: "text-gray-500",
        button: "bg-gray-500 hover:bg-gray-600",
      },
      Copper: {
        border: "border-orange-200",
        text: "text-orange-600",
        icon: "text-orange-500",
        button: "bg-orange-500 hover:bg-orange-600",
      },
    }
    return styles[tier] || styles.Copper
  }

  const userTier = getTier(user?.coins)
  const tierStyles = getTierStyles(userTier)

  const AnonymousMessageModal = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 max-w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Send Anonymous Message</h3>
        <textarea
          value={anonymousMessage}
          onChange={(e) => setAnonymousMessage(e.target.value)}
          className="w-full p-4 border rounded-xl mb-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type your message here..."
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowAnonymousModal(false)}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSendAnonymousMessage}
            className={`px-4 py-2 rounded-full text-white transition-all ${tierStyles.button}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {showAnonymousModal && <AnonymousMessageModal />}
      {statusMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          {statusMessage}
        </div>
      )}

      <div
        className={`w-full rounded-2xl bg-white border ${tierStyles.border} p-6 transition-all duration-300 hover:shadow-lg`}
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="relative">
              <img
                src={user?.picture || "/placeholder.svg"}
                alt={`${user?.name}'s profile`}
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
              />
              <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white ${tierStyles.border}`}>
                <div className={tierStyles.icon}>{getTierIcon(userTier)}</div>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-1">{user?.name}</h2>
          <div className="flex items-center gap-1 mb-4">
            <Coins className={`w-4 h-4 ${tierStyles.icon}`} />
            <span className={`text-sm font-medium ${tierStyles.text}`}>{user?.coins}</span>
          </div>

          {isCurrentUser ? (
            <div className="w-full space-y-2">
              <button
                onClick={() => onViewProfile(user._id)}
                className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all inline-flex items-center justify-center gap-2"
              >
                <UserRound className="w-4 h-4" />
                View Profile
              </button>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSendCoins(user?.email)}
                  className="px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all inline-flex items-center justify-center gap-1"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
                <button
                  onClick={() => onConnect(user._id)}
                  className="px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all inline-flex items-center justify-center gap-1"
                >
                  <UserRound className="w-4 h-4" />
                  Connect
                </button>
              </div>
              <button
                onClick={handleAnonymousConnect}
                className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Anonymously
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card;