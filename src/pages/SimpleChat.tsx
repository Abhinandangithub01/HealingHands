import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Shield, Users, Lock, AlertTriangle, Smile, MoreVertical, UserPlus } from 'lucide-react'
import { zkChat, ChatMessage, ChatRoom } from '../lib/midnight/zkChat'
import { zkAuth } from '../lib/midnight/zkAuthentication'

const SimpleChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [identity, setIdentity] = useState<any>(null)
  const [networkStatus, setNetworkStatus] = useState({ connected: false, proofServerAvailable: false })
  const [typing, setTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)

  // Emoji reactions
  const emojis = ['👍', '❤️', '😊', '😢', '🤗', '💪', '🙏', '✨']

  useEffect(() => {
    initializeChat()
    
    // Set up real-time message polling
    const messageInterval = setInterval(() => {
      if (currentRoom) {
        refreshMessages()
      }
    }, 2000)

    return () => clearInterval(messageInterval)
  }, [currentRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    try {
      // Get user identity
      const userIdentity = await zkAuth.getIdentity()
      if (!userIdentity) {
        console.error('No identity found - redirecting to authentication')
        return
      }
      setIdentity(userIdentity)

      // Load available rooms
      const availableRooms = zkChat.getRooms()
      setRooms(availableRooms)

      // Join default room (general-support)
      const defaultRoom = availableRooms.find(room => room.id === 'general-support') || availableRooms[0]
      if (defaultRoom) {
        await joinRoom(defaultRoom)
      }

      // Check network status
      const status = zkChat.getNetworkStatus()
      setNetworkStatus(status)

      // Simulate online users
      setOnlineUsers(['Anonymous123', 'Helper456', 'Supporter789'])

    } catch (error) {
      console.error('Failed to initialize chat:', error)
    }
  }

  const refreshMessages = async () => {
    if (currentRoom) {
      const roomMessages = zkChat.getMessages(currentRoom.id)
      setMessages(roomMessages)
    }
  }

  const joinRoom = async (room: ChatRoom) => {
    if (!identity) return

    setLoading(true)
    try {
      // Join room with ZK proof
      const result = await zkChat.joinRoom(room.id, identity.secret)
      
      if (result.success) {
        setCurrentRoom(room)
        
        // Load messages for this room
        const roomMessages = zkChat.getMessages(room.id)
        setMessages(roomMessages)
        
        console.log(`✅ Joined room: ${room.name}`)
      }
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentRoom || !identity) return

    setLoading(true)
    setTyping(false)
    
    try {
      // Send message with ZK proof
      const message = await zkChat.sendMessage(
        newMessage.trim(),
        currentRoom.id,
        identity.username,
        identity.secret
      )

      // Update messages immediately
      const updatedMessages = zkChat.getMessages(currentRoom.id)
      setMessages(updatedMessages)
      
      setNewMessage('')
      messageInputRef.current?.focus()
      console.log('✅ Message sent with ZK proof')
      
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    messageInputRef.current?.focus()
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    // Simulate typing indicator
    if (!typing && e.target.value.length > 0) {
      setTyping(true)
      setTimeout(() => setTyping(false), 2000)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getRoomIcon = (roomId: string) => {
    switch (roomId) {
      case 'general-support': return '💬'
      case 'anxiety-support': return '🌸'
      case 'depression-support': return '🌙'
      case 'crisis-support': return '🆘'
      default: return '💭'
    }
  }

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please authenticate to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HealingHands Chat</h1>
                <p className="text-gray-600 mt-1">Anonymous support conversations</p>
              </div>
              
              {/* Network Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${networkStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    {networkStatus.connected ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-white shadow-lg rounded-b-2xl overflow-hidden" style={{ height: '700px' }}>
            {/* Room Sidebar */}
            <div className="w-1/3 bg-gray-50 border-r flex flex-col">
              {/* Rooms Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Support Rooms
                  </h3>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rooms List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => joinRoom(room)}
                    disabled={loading}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      currentRoom?.id === room.id
                        ? 'bg-blue-100 border-2 border-blue-300 shadow-sm'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getRoomIcon(room.id)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{room.name}</div>
                        <div className="text-sm text-gray-600 truncate">{room.description}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {room.memberCount} members
                          {currentRoom?.id === room.id && (
                            <span className="ml-2 text-green-600">• Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Online Users */}
              <div className="p-4 border-t bg-white">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Online Now ({onlineUsers.length})</h4>
                <div className="space-y-1">
                  {onlineUsers.slice(0, 3).map((user, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">{user}</span>
                    </div>
                  ))}
                  {onlineUsers.length > 3 && (
                    <div className="text-xs text-gray-500">+{onlineUsers.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentRoom ? (
                <>
                  {/* Room Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getRoomIcon(currentRoom.id)}</span>
                        <div>
                          <h2 className="font-semibold text-gray-900">{currentRoom.name}</h2>
                          <p className="text-sm text-gray-600">{currentRoom.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Lock className="h-4 w-4" />
                          <span>End-to-end encrypted</span>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No messages yet. Start the conversation!</p>
                        <p className="text-sm mt-2">Your messages are encrypted and anonymous</p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isOwn = message.sender === identity.username
                        const showAvatar = index === 0 || messages[index - 1].sender !== message.sender
                        
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex space-x-3 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {showAvatar && !isOwn && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {message.sender.charAt(0)}
                                </div>
                              )}
                              
                              <div className={`px-4 py-2 rounded-2xl relative group ${
                                isOwn
                                  ? 'bg-blue-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                              }`}>
                                {!isOwn && showAvatar && (
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-medium opacity-75">
                                      {message.sender}
                                    </span>
                                    {message.rlnProof && (
                                      <Shield className="h-3 w-3 opacity-75" title="ZK Verified" />
                                    )}
                                  </div>
                                )}
                                
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                
                                <div className={`text-xs mt-1 flex items-center justify-between ${
                                  isOwn ? 'text-blue-200' : 'text-gray-500'
                                }`}>
                                  <span>{formatTime(message.timestamp)}</span>
                                  {message.rlnProof && (
                                    <Shield className="h-3 w-3 ml-1" title="ZK Proof Verified" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                    
                    {typing && (
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>Someone is typing...</span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-end space-x-2">
                      {/* Emoji Picker */}
                      <div className="relative">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        
                        {showEmojiPicker && (
                          <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1">
                            {emojis.map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => addEmoji(emoji)}
                                className="p-2 hover:bg-gray-100 rounded text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Input */}
                      <div className="flex-1 relative">
                        <input
                          ref={messageInputRef}
                          type="text"
                          value={newMessage}
                          onChange={handleTyping}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          disabled={loading}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      
                      {/* Send Button */}
                      <button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-3 w-3" />
                        <span>Messages are encrypted and anonymous</span>
                      </div>
                      
                      {!networkStatus.proofServerAvailable && (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Fallback mode</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Select a room to start chatting</p>
                    <p className="text-sm mt-2">Join a support group to connect with others</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SimpleChat
