import React, { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Menu, X, ChevronDown, LogOut } from "lucide-react"

function Navbar() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser")
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      const checkUser = async () => {
        try {
          const response = await axios.get(`/api/users/${user.email}`)
          if (response.data) {
            setLoggedInUser(response.data)
            localStorage.setItem("loggedInUser", JSON.stringify(response.data))
          } else {
            navigate("/register")
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            navigate("/register")
          } else {
            console.error("Error checking user:", error)
          }
        }
      }
      checkUser()
    }
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    setLoggedInUser(null)
    logout({ returnTo: window.location.origin })
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Connect", path: "/connect" },
    { name: "Insights", path: "/insights" },
    { name: "Smart Picks", path: "/smart-picks" },
  ]

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-gray-800 text-2xl font-bold tracking-wider">
            Guide<span className="text-blue-500">X</span>
          </Link>

          <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {loggedInUser ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowPopup(!showPopup)}>
                  <img
                    src={loggedInUser.picture || "/placeholder.svg"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 transition duration-300 ease-in-out transform group-hover:scale-105"
                  />
                  <ChevronDown className="text-gray-600 group-hover:text-blue-500 transition duration-300" />
                </div>
                {showPopup && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-semibold">{loggedInUser.name}</p>
                      <p className="text-xs text-gray-500">{loggedInUser.email}</p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Login
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600 focus:outline-none">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block text-gray-600 hover:text-blue-500 transition duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;