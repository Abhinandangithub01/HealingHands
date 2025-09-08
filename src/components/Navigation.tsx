import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Shield, MessageCircle, User, Home, DollarSign, BarChart3, Settings } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/auth', icon: Shield, label: 'Identity' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/financial-help', icon: DollarSign, label: 'Financial Help' },
    { path: '/privacy', icon: Shield, label: 'Privacy' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">HealingHands</span>
              <span className="text-xs text-gray-500 -mt-1">Healing minds, helping hands</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
