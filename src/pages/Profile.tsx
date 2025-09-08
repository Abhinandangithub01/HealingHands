import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  User, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Trash2,
  Lock, 
  Users, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Heart,
  DollarSign
} from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

const Profile = () => {
  const navigate = useNavigate()
  const [identity, setIdentity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentIdentity = await zkAuth.getIdentity()
      if (!currentIdentity) {
        navigate('/auth')
        return
      }
      setIdentity(currentIdentity)
    } catch (error) {
      console.error('Failed to load profile:', error)
      navigate('/auth')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinChat = () => {
    navigate('/chat')
  }

  const handleFinancialHelp = () => {
    navigate('/financial-help')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const result = await zkAuth.deleteAccount()
      if (result.success) {
        // Redirect to landing page after successful deletion
        navigate('/')
      } else {
        alert('Failed to delete account: ' + result.error)
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {identity?.username}
          </h1>
          <p className="text-gray-600">Your HealingHands dashboard - healing minds, helping hands</p>
        </motion.div>

        {/* Privacy Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Privacy Protection</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Active</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">ZK Identity</h3>
              <p className="text-sm text-gray-600">Anonymous verification active</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Encryption</h3>
              <p className="text-sm text-gray-600">End-to-end encrypted</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Eye className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Anonymity</h3>
              <p className="text-sm text-gray-600">Identity protected</p>
            </div>
          </div>
        </motion.div>

        {/* Stats and Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Anonymous ID</span>
                </div>
                <span className="font-mono text-sm text-gray-900">{identity?.anonymousId}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Support Condition</span>
                </div>
                <span className="text-gray-900 capitalize">{identity?.condition || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Member Since</span>
                </div>
                <span className="text-gray-900">
                  {identity?.createdAt ? new Date(identity.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleJoinChat}
                className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Join Support Chat</div>
                  <div className="text-sm text-gray-600">Connect with anonymous peers</div>
                </div>
              </button>
              
              <button
                onClick={handleFinancialHelp}
                className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <DollarSign className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Financial Help</div>
                  <div className="text-sm text-gray-600">Anonymous fundraising & donations</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full flex items-center space-x-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Update Verification</div>
                  <div className="text-sm text-gray-600">Modify support condition</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Return to Home</div>
                  <div className="text-sm text-gray-600">Go back to landing page</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h3>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">Delete Anonymous Account</h4>
                <p className="text-red-700 mb-4">
                  This will permanently delete your anonymous identity, all chat messages, and associated data. 
                  This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Anonymous Account?
              </h3>
              
              <p className="text-gray-600 mb-6">
                This will permanently delete your identity "{identity?.username}" and all associated data. 
                You will be redirected to the home page.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Forever</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Profile
