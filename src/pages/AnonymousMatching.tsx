import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, Zap, Clock, Star, ArrowRight, Eye, Lock, Target, Calendar, MessageCircle } from 'lucide-react'
import { useMidnight, findCompatibleGroups } from '../lib/midnight/useMidnight'
import { zkAuth } from '../lib/midnight/zkAuthentication'
import { smartContracts } from '../lib/midnight/smartContracts'

interface SupportGroup {
  id: string
  name: string
  category: string
  supportTypes: string[]
  memberCount: number
  compatibilityScore: number
  description: string
  meetingFrequency: string
  averageExperience: string
  communicationStyle: string
  meetingTimes: string[]
  averageSeverity: string
  privacyLevel: 'high' | 'maximum'
  ageRange: string
  specialFocus: string
  isRecommended: boolean
}

const AnonymousMatching = () => {
  const [isMatching, setIsMatching] = useState(true)
  const [recommendedGroups, setRecommendedGroups] = useState<SupportGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null)
  const { joinGroupAnonymously, isLoading } = useMidnight()
  const navigate = useNavigate()

  useEffect(() => {
    findCompatibleGroupsForUser()
  }, [])

  const findCompatibleGroupsForUser = async () => {
    setIsMatching(true)
    
    try {
      // Get user preferences from localStorage (set during onboarding)
      const userPreferences = localStorage.getItem('user_preferences')
      const userProfile = userPreferences ? JSON.parse(userPreferences) : {
        condition_category: 'anxiety',
        severity_level: 2,
        interaction_style: 1,
        session_frequency: 1,
        group_size_pref: 2,
        experience_level: 1,
        treatment_duration: 0
      }

      // Use enhanced matching algorithm
      const compatibleGroups = await findCompatibleGroups(userProfile)
      setRecommendedGroups(compatibleGroups)
    } catch (error) {
      console.error('Failed to find compatible groups:', error)
      // Fallback to mock data if needed
      setRecommendedGroups([])
    } finally {
      setIsMatching(false)
    }
  }

  const handleJoinGroup = async (group: SupportGroup) => {
    try {
      // Get current user ID from localStorage
      const currentUserId = localStorage.getItem('current_user_id')
      if (!currentUserId) {
        navigate('/onboarding')
        return
      }

      // Check if user has ZK identity
      const identity = zkAuth.getIdentity(currentUserId)
      if (!identity) {
        navigate('/onboarding')
        return
      }

      // Get user preferences for bond calculation
      const userPreferences = localStorage.getItem('user_preferences')
      const preferences = userPreferences ? JSON.parse(userPreferences) : {}
      
      // Calculate bond requirement based on group and user profile
      const bondRequired = 1000 // Base bond amount
      const userBalance = 10000 // Mock user balance
      
      if (userBalance < bondRequired) {
        alert(`Insufficient tokens for bonding. Required: ${bondRequired}, Available: ${userBalance}`)
        return
      }

      // Join group using zkAuth system
      const membership = await zkAuth.joinGroup(
        currentUserId,
        group.id,
        bondRequired,
        userBalance,
        bondRequired
      )
      
      if (membership) {
        console.log('✅ Successfully joined group:', group.id)
        navigate(`/chat/${group.id}`)
      } else {
        throw new Error('Failed to join group')
      }
    } catch (error) {
      console.error('Failed to join group:', error)
      alert('Failed to join group. Please try again.')
    }
  }

  if (isMatching) {
    return <MatchingLoader />
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Anonymous Matches
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced matching algorithm found {recommendedGroups.length} highly compatible support groups 
            based on your encrypted preferences, communication style, and availability.
          </p>
        </motion.div>

        <PrivacyIndicator />
        <MatchingInsights groups={recommendedGroups} />

        <div className="space-y-6">
          {recommendedGroups.map((group, index) => (
            <GroupCard
              key={group.id}
              group={group}
              index={index}
              onJoin={() => handleJoinGroup(group)}
              onPreview={() => setSelectedGroup(group)}
              isJoining={isLoading}
            />
          ))}
        </div>

        {recommendedGroups.length === 0 && !isMatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Compatible Groups Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find groups that match your current preferences. Try adjusting your criteria or check back later.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="secondary-button"
            >
              Update Preferences
            </button>
          </motion.div>
        )}

        {selectedGroup && (
          <GroupPreviewModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
            onJoin={() => handleJoinGroup(selectedGroup)}
            isJoining={isLoading}
          />
        )}
      </div>
    </div>
  )
}

const MatchingLoader = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    'Analyzing your encrypted preferences...',
    'Finding compatible support groups...',
    'Calculating privacy-preserving compatibility scores...',
    'Preparing your anonymous matches...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 750)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        <motion.div
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-12 h-12 text-white" />
        </motion.div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Finding Your Perfect Match
          </h2>
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-600"
          >
            {steps[currentStep]}
          </motion.p>
        </div>

        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const PrivacyIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-center space-x-4">
        <Shield className="w-6 h-6 text-blue-600" />
        <div className="text-center">
          <h3 className="font-semibold text-blue-900">Privacy Protected</h3>
          <p className="text-sm text-blue-700">
            Groups see compatibility scores, not your personal information
          </p>
        </div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  )
}

const MatchingInsights = ({ groups }: { groups: SupportGroup[] }) => {
  if (groups.length === 0) return null

  const avgCompatibility = Math.round(
    groups.reduce((sum, group) => sum + group.compatibilityScore, 0) / groups.length
  )
  const topMatch = groups[0]
  const recommendedCount = groups.filter(g => g.isRecommended).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Matching Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {avgCompatibility}%
          </div>
          <div className="text-sm text-gray-600">Average Compatibility</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {topMatch?.compatibilityScore}%
          </div>
          <div className="text-sm text-gray-600">Best Match Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {recommendedCount}
          </div>
          <div className="text-sm text-gray-600">Highly Recommended</div>
        </div>
      </div>
    </motion.div>
  )
}

const GroupCard = ({ group, index, onJoin, onPreview, isJoining }: {
  group: SupportGroup
  index: number
  onJoin: () => void
  onPreview: () => void
  isJoining: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
            {group.isRecommended && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                ⭐ Top Match
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-3">{group.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {group.supportTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
              >
                {type}
              </span>
            ))}
            {group.supportTypes.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{group.supportTypes.length - 3} more
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{group.memberCount} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{group.meetingFrequency}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{group.communicationStyle}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{group.meetingTimes.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="text-right ml-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {group.compatibilityScore}%
          </div>
          <div className="text-xs text-gray-500 mb-2">Match Score</div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            group.privacyLevel === 'maximum' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {group.privacyLevel === 'maximum' ? '🛡️ Maximum Privacy' : '🔒 High Privacy'}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {group.ageRange} • {group.specialFocus}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPreview}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
        <button
          onClick={onJoin}
          disabled={isJoining}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 inline-flex items-center justify-center space-x-2"
        >
          {isJoining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span>Join Anonymously</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

const GroupPreviewModal = ({ group, onClose, onJoin, isJoining }: {
  group: SupportGroup
  onClose: () => void
  onJoin: () => void
  isJoining: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {group.compatibilityScore}% Match
          </div>
          <p className="text-sm text-gray-600">Based on your encrypted preferences</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Support Focus</h4>
            <div className="flex flex-wrap gap-2">
              {group.supportTypes.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Members:</span>
              <span className="font-medium">{group.memberCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-medium">{group.meetingFrequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">{group.averageExperience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Style:</span>
              <span className="font-medium">{group.communicationStyle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age Range:</span>
              <span className="font-medium">{group.ageRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Privacy:</span>
              <span className={`font-medium ${
                group.privacyLevel === 'maximum' ? 'text-green-600' : 'text-gray-700'
              }`}>
                {group.privacyLevel === 'maximum' ? 'Maximum' : 'High'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Meeting Times</h4>
            <div className="flex flex-wrap gap-2">
              {group.meetingTimes.map((time) => (
                <span
                  key={time}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Special Focus</h4>
            <p className="text-sm text-gray-600">{group.specialFocus}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Privacy Guarantee</span>
          </div>
          <p className="text-sm text-blue-700">
            Your identity remains completely anonymous. All communications are end-to-end encrypted 
            and your personal information is never shared with group members.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onJoin}
            disabled={isJoining}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isJoining ? 'Joining...' : 'Join Group'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AnonymousMatching
