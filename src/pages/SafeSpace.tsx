import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, MessageCircle, Heart, Lock, Eye, EyeOff, Send, Smile, MoreVertical, AlertTriangle, CheckCircle } from 'lucide-react'

const SafeSpace = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)
  const [activeUsers, setActiveUsers] = useState(12)

  const safetyGuidelines = [
    {
      icon: Shield,
      title: 'Respect Privacy',
      description: 'Never ask for or share personal identifying information'
    },
    {
      icon: Heart,
      title: 'Be Supportive',
      description: 'Offer encouragement and understanding to fellow members'
    },
    {
      icon: Users,
      title: 'Stay Anonymous',
      description: 'Use only your generated anonymous identity in conversations'
    },
    {
      icon: Lock,
      title: 'Keep It Confidential',
      description: 'What is shared here stays here - respect confidentiality'
    }
  ]

  const mockMessages = [
    {
      id: 1,
      sender: 'BraveEagle404',
      content: 'Just wanted to say thank you to everyone here. This community has been so helpful.',
      timestamp: '2 minutes ago',
      isOwn: false
    },
    {
      id: 2,
      sender: 'KindWolf892',
      content: 'Having a tough day today. The anxiety is really getting to me.',
      timestamp: '5 minutes ago',
      isOwn: false
    },
    {
      id: 3,
      sender: 'You',
      content: 'Sending you strength! Remember that difficult days are temporary.',
      timestamp: '3 minutes ago',
      isOwn: true
    }
  ]

  useEffect(() => {
    setMessages(mockMessages)
    
    // Simulate active user count updates
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      timestamp: 'Just now',
      isOwn: true
    }
    
    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Safe Space</h1>
          <p className="text-xl text-gray-600 mb-4">
            Anonymous support conversations in a protected environment
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">{activeUsers} active members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Anonymous identities</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Safety Guidelines */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Community Guidelines
              </h2>
              
              <div className="space-y-4">
                {safetyGuidelines.map((guideline, index) => (
                  <motion.div
                    key={guideline.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <guideline.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{guideline.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{guideline.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Safe Environment</p>
                    <p className="text-xs text-green-700 mt-1">
                      This space is monitored for safety while preserving your anonymity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <div>
                      <h2 className="text-xl font-bold text-white">General Support</h2>
                      <p className="text-blue-100 text-sm">Open conversation for all members</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {showPrivacyInfo ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                    </button>
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Info */}
              {showPrivacyInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 border-b px-6 py-4"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Privacy Protection Active</p>
                      <p className="text-xs text-blue-700">
                        Messages are encrypted, identities are anonymous, and no personal data is stored
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isOwn 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}>
                      {!message.isOwn && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {message.sender.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-600">{message.sender}</span>
                          <Shield className="w-3 h-3 text-green-500" title="Verified Anonymous" />
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white border-t">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Anonymous User</span>
                      </div>
                      <Shield className="w-3 h-3 text-green-500" />
                    </div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your thoughts safely and anonymously..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Messages are encrypted</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Identity is anonymous</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span>Report inappropriate content</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Emergency Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Crisis Support Available</h3>
              <p className="text-red-800 mb-4">
                If you're experiencing a mental health crisis or having thoughts of self-harm, 
                please reach out for immediate professional help.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Crisis Hotline
                </button>
                <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                  Emergency Resources
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SafeSpace
