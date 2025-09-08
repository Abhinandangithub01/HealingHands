import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Send, 
  Shield, 
  Users, 
  MoreVertical, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Flag, 
  Heart, 
  ThumbsUp, 
  Smile,
  Paperclip,
  Calendar,
  Settings,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { zkChat } from '../lib/midnight/zkChat'
import { zkAuth } from '../lib/midnight/zkAuthentication'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: Date
  encrypted: boolean
  reactions: { [emoji: string]: string[] }
  isSystem?: boolean
  type: 'text' | 'system' | 'join' | 'leave'
  rlnProof?: any
}

interface GroupMember {
  id: string
  name: string
  isOnline: boolean
  joinedAt: Date
  isMuted: boolean
  isBlocked: boolean
}

interface GroupInfo {
  id: string
  name: string
  description: string
  memberCount: number
  type: string
  guidelines: string[]
  isPrivate: boolean
}

const GroupChat = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showMembers, setShowMembers] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [isJoined, setIsJoined] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initializeChat()
  }, [groupId])

  const initializeChat = async () => {
    try {
      // Get current user identity
      const identity = await zkAuth.getIdentity()
      if (!identity) {
        navigate('/onboarding')
        return
      }
      setCurrentUser(identity)

      // Join the chat room with ZK proof
      if (groupId) {
        const joinResult = await zkChat.joinChatRoom(groupId)
        if (joinResult.success) {
          setIsJoined(true)
          
          // Load chat history
          const history = await zkChat.getChatHistory(groupId)
          setMessages(history.messages || [])
          
          // Subscribe to new messages
          zkChat.subscribeToMessages(groupId, (message) => {
            setMessages(prev => [...prev, message])
          })

          // Load group info
          const groupData = await zkChat.getGroupInfo(groupId)
          setGroupInfo(groupData)
        } else {
          console.error('Failed to join chat room:', joinResult.error)
          navigate('/dashboard')
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !groupId) return

    try {
      // Send message with RLN proof
      const result = await zkChat.sendMessage(groupId, newMessage)
      
      if (result.success) {
        // Message will be added via subscription
        setNewMessage('')
        inputRef.current?.focus()
      } else {
        alert('Failed to send message: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!groupId) return
    
    try {
      const result = await zkChat.addReaction(groupId, messageId, emoji)
      if (result.success) {
        // Update local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...msg.reactions }
            const userId = currentUser?.anonymousId || 'user'
            
            if (reactions[emoji]) {
              if (reactions[emoji].includes(userId)) {
                reactions[emoji] = reactions[emoji].filter(id => id !== userId)
                if (reactions[emoji].length === 0) {
                  delete reactions[emoji]
                }
              } else {
                reactions[emoji].push(userId)
              }
            } else {
              reactions[emoji] = [userId]
            }
            
            return { ...msg, reactions }
          }
          return msg
        }))
      }
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }

  const handleReportMessage = async (messageId: string) => {
    if (!groupId) return
    
    const reason = prompt('Please describe why you are reporting this message:')
    if (!reason) return

    try {
      const result = await zkAuth.reportHarassment(groupId, messageId, reason)
      if (result.success) {
        alert('Message reported successfully. Thank you for keeping our community safe.')
      } else {
        alert('Failed to report message: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to report message:', error)
      alert('Failed to report message. Please try again.')
    }
  }

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group? Your bond will be returned.')) return
    
    try {
      if (groupId) {
        await zkChat.leaveChatRoom(groupId)
        await zkAuth.leaveGroup(groupId)
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to leave group:', error)
      alert('Failed to leave group. Please try again.')
    }
  }

  const handleMuteMember = async (memberId: string) => {
    try {
      const result = await zkChat.muteMember(groupId!, memberId)
      if (result.success) {
        setMembers(prev => prev.map(member => 
          member.id === memberId 
            ? { ...member, isMuted: !member.isMuted }
            : member
        ))
      } else {
        alert('Failed to mute member: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to mute member:', error)
      alert('Failed to mute member. Please try again.')
    }
  }

  const handleBlockMember = async (memberId: string) => {
    try {
      const result = await zkChat.blockMember(groupId!, memberId)
      if (result.success) {
        setMembers(prev => prev.map(member => 
          member.id === memberId 
            ? { ...member, isBlocked: !member.isBlocked }
            : member
        ))
      } else {
        alert('Failed to block member: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to block member:', error)
      alert('Failed to block member. Please try again.')
    }
  }

  if (!groupInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading group chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{groupInfo.name}</h1>
                <p className="text-sm text-gray-600">{groupInfo.memberCount} members</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Users className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="mt-3 flex items-center space-x-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          <Shield className="w-4 h-4" />
          <span>End-to-end encrypted • Anonymous identities • Safe space</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUser?.anonymousId}
                  onReaction={(emoji) => handleReaction(message.id, emoji)}
                  onReport={() => handleReportMessage(message.id)}
                />
              ))}
            </AnimatePresence>
            
            {/* Typing Indicators */}
            {isTyping.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>{isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a supportive message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              Messages are end-to-end encrypted and anonymous
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Members ({members.length})</h3>
                  <button
                    onClick={() => setShowMembers(false)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onMute={() => handleMuteMember(member.id)}
                      onBlock={() => handleBlockMember(member.id)}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowGuidelines(!showGuidelines)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Group Guidelines</span>
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                  
                  {showGuidelines && (
                    <div className="mt-3 space-y-2">
                      {groupInfo.guidelines.map((guideline, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{guideline}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Leave Group
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const MessageBubble = ({ 
  message, 
  isOwn, 
  onReaction, 
  onReport 
}: {
  message: Message
  isOwn: boolean
  onReaction: (emoji: string) => void
  onReport: () => void
}) => {
  const [showActions, setShowActions] = useState(false)

  if (message.isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>{message.content}</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
            {message.encrypted && <Shield className="w-3 h-3 text-green-600" />}
          </div>
        )}
        
        <div
          className={`relative group ${
            isOwn 
              ? 'bg-blue-600 text-white message-bubble-own' 
              : 'bg-white border border-gray-100 text-gray-900 message-bubble-other'
          } message-bubble`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <p>{message.content}</p>
          
          {/* Reactions */}
          {Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  onClick={() => onReaction(emoji)}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-gray-600">{userIds.length}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Quick Actions */}
          {showActions && (
            <div className={`absolute top-0 ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1`}>
              <button
                onClick={() => onReaction('❤️')}
                className="p-1 hover:bg-gray-100 rounded text-sm"
              >
                ❤️
              </button>
              <button
                onClick={() => onReaction('👍')}
                className="p-1 hover:bg-gray-100 rounded text-sm"
              >
                👍
              </button>
              <button
                onClick={() => onReaction('🤗')}
                className="p-1 hover:bg-gray-100 rounded text-sm"
              >
                🤗
              </button>
              {!isOwn && (
                <button
                  onClick={onReport}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <Flag className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && message.encrypted && (
            <Shield className="w-3 h-3 text-green-600" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MemberCard = ({ 
  member, 
  onMute, 
  onBlock 
}: {
  member: GroupMember
  onMute: () => void
  onBlock: () => void
}) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div>
          <p className={`font-medium ${member.isMuted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {member.name}
          </p>
          <p className="text-xs text-gray-500">
            Joined {member.joinedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {showActions && (
        <div className="flex items-center space-x-1">
          <button
            onClick={onMute}
            className={`p-1 rounded ${
              member.isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title={member.isMuted ? 'Unmute' : 'Mute'}
          >
            {member.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
          <button
            onClick={onBlock}
            className={`p-1 rounded ${
              member.isBlocked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title={member.isBlocked ? 'Unblock' : 'Block'}
          >
            {member.isBlocked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  )
}

export default GroupChat
