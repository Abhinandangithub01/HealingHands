import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  MessageCircle, 
  Shield, 
  Clock, 
  Star, 
  Heart, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Zap,
  User,
  Calendar,
  Globe,
  Lock,
  Eye,
  Filter,
  RotateCcw
} from 'lucide-react'

interface PeerSupporter {
  id: string
  anonymousName: string
  supportTypes: string[]
  experienceLevel: 'new' | 'experienced' | 'veteran'
  availability: string[]
  timezone: string
  languages: string[]
  rating: number
  totalSessions: number
  isOnline: boolean
  lastActive: string
  bio: string
  specialties: string[]
  communicationStyle: 'listener' | 'advisor' | 'balanced'
  matchScore: number
}

interface MatchPreferences {
  supportType: string
  experienceLevel: string
  communicationStyle: string
  availability: string
  language: string
}

const PeerMatching = () => {
  const navigate = useNavigate()
  const [isMatching, setIsMatching] = useState(false)
  const [availablePeers, setAvailablePeers] = useState<PeerSupporter[]>([])
  const [selectedPeer, setSelectedPeer] = useState<PeerSupporter | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [matchPreferences, setMatchPreferences] = useState<MatchPreferences>({
    supportType: 'anxiety',
    experienceLevel: 'any',
    communicationStyle: 'balanced',
    availability: 'flexible',
    language: 'english'
  })

  useEffect(() => {
    findAvailablePeers()
  }, [])

  const findAvailablePeers = async () => {
    setIsMatching(true)
    
    // Simulate matching delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockPeers: PeerSupporter[] = [
      {
        id: '1',
        anonymousName: 'WiseOwl247',
        supportTypes: ['anxiety', 'depression', 'stress'],
        experienceLevel: 'veteran',
        availability: ['evening', 'night'],
        timezone: 'EST',
        languages: ['english', 'spanish'],
        rating: 4.9,
        totalSessions: 156,
        isOnline: true,
        lastActive: 'now',
        bio: 'I\'ve been supporting others through anxiety and depression for over 3 years. I believe in gentle guidance and active listening.',
        specialties: ['Panic attacks', 'Social anxiety', 'Mindfulness'],
        communicationStyle: 'listener',
        matchScore: 95
      },
      {
        id: '2',
        anonymousName: 'CalmDolphin88',
        supportTypes: ['anxiety', 'relationships', 'self-esteem'],
        experienceLevel: 'experienced',
        availability: ['morning', 'afternoon'],
        timezone: 'PST',
        languages: ['english'],
        rating: 4.7,
        totalSessions: 89,
        isOnline: true,
        lastActive: '5 minutes ago',
        bio: 'Specializing in anxiety management and building healthy relationships. I use CBT techniques and mindfulness practices.',
        specialties: ['CBT techniques', 'Relationship advice', 'Confidence building'],
        communicationStyle: 'advisor',
        matchScore: 88
      },
      {
        id: '3',
        anonymousName: 'KindBear42',
        supportTypes: ['depression', 'grief', 'trauma'],
        experienceLevel: 'experienced',
        availability: ['evening', 'weekend'],
        timezone: 'CST',
        languages: ['english', 'french'],
        rating: 4.8,
        totalSessions: 124,
        isOnline: false,
        lastActive: '2 hours ago',
        bio: 'Compassionate support for those dealing with loss and difficult emotions. I focus on creating a safe, non-judgmental space.',
        specialties: ['Grief counseling', 'Trauma support', 'Emotional regulation'],
        communicationStyle: 'balanced',
        matchScore: 82
      },
      {
        id: '4',
        anonymousName: 'BrightSun91',
        supportTypes: ['anxiety', 'adhd', 'stress'],
        experienceLevel: 'new',
        availability: ['afternoon', 'evening'],
        timezone: 'EST',
        languages: ['english'],
        rating: 4.5,
        totalSessions: 23,
        isOnline: true,
        lastActive: 'now',
        bio: 'New to peer support but passionate about helping others with anxiety and ADHD. I bring fresh energy and understanding.',
        specialties: ['ADHD coping', 'Study stress', 'Time management'],
        communicationStyle: 'balanced',
        matchScore: 76
      }
    ]
    
    setAvailablePeers(mockPeers.sort((a, b) => b.matchScore - a.matchScore))
    setIsMatching(false)
  }

  const handleConnectWithPeer = async (peer: PeerSupporter) => {
    // Mock connection process
    const confirmed = confirm(`Connect with ${peer.anonymousName} for a one-on-one support session?`)
    if (confirmed) {
      // In a real app, this would create a private chat room
      navigate(`/peer-chat/${peer.id}`)
    }
  }

  const handleRefreshMatches = () => {
    findAvailablePeers()
  }

  if (isMatching) {
    return <MatchingLoader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            One-on-One Peer Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with trained peer supporters for private, anonymous conversations. 
            All matches are based on your preferences and availability.
          </p>
        </motion.div>

        {/* Privacy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            <Shield className="w-6 h-6 text-green-600" />
            <div className="text-center">
              <h3 className="font-semibold text-green-900">Complete Privacy Protection</h3>
              <p className="text-sm text-green-700">
                All conversations are end-to-end encrypted. Neither you nor your peer supporter can see real identities.
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <span className="text-sm text-gray-600">
              {availablePeers.length} peer supporters available
            </span>
          </div>
          
          <button
            onClick={handleRefreshMatches}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh Matches
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Preferences</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Type</label>
                  <select 
                    value={matchPreferences.supportType}
                    onChange={(e) => setMatchPreferences(prev => ({ ...prev, supportType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="stress">Stress</option>
                    <option value="relationships">Relationships</option>
                    <option value="grief">Grief & Loss</option>
                    <option value="trauma">Trauma</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Communication Style</label>
                  <select 
                    value={matchPreferences.communicationStyle}
                    onChange={(e) => setMatchPreferences(prev => ({ ...prev, communicationStyle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="listener">Good Listener</option>
                    <option value="advisor">Advice Giver</option>
                    <option value="balanced">Balanced Approach</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select 
                    value={matchPreferences.availability}
                    onChange={(e) => setMatchPreferences(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Peer Supporters Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {availablePeers.map((peer, index) => (
            <PeerCard
              key={peer.id}
              peer={peer}
              index={index}
              onConnect={() => handleConnectWithPeer(peer)}
              onViewProfile={() => setSelectedPeer(peer)}
            />
          ))}
        </div>

        {/* Peer Profile Modal */}
        <AnimatePresence>
          {selectedPeer && (
            <PeerProfileModal
              peer={selectedPeer}
              onClose={() => setSelectedPeer(null)}
              onConnect={() => handleConnectWithPeer(selectedPeer)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const MatchingLoader = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    'Finding available peer supporters...',
    'Analyzing compatibility scores...',
    'Checking availability and timezones...',
    'Preparing your matches...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        <motion.div
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center"
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

const PeerCard = ({ peer, index, onConnect, onViewProfile }: {
  peer: PeerSupporter
  index: number
  onConnect: () => void
  onViewProfile: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{peer.anonymousName}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${peer.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {peer.isOnline ? 'Online now' : `Last active ${peer.lastActive}`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {peer.matchScore}%
          </div>
          <div className="text-xs text-gray-500">Match Score</div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{peer.bio}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium capitalize">{peer.experienceLevel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sessions:</span>
          <span className="font-medium">{peer.totalSessions}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Rating:</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{peer.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {peer.supportTypes.slice(0, 3).map((type) => (
          <span
            key={type}
            className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
          >
            {type}
          </span>
        ))}
        {peer.supportTypes.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            +{peer.supportTypes.length - 3} more
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewProfile}
          className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View Profile</span>
        </button>
        <button
          onClick={onConnect}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Connect</span>
        </button>
      </div>
    </motion.div>
  )
}

const PeerProfileModal = ({ peer, onClose, onConnect }: {
  peer: PeerSupporter
  onClose: () => void
  onConnect: () => void
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
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{peer.anonymousName}</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${peer.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {peer.isOnline ? 'Online now' : `Last active ${peer.lastActive}`}
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {peer.matchScore}% Match
          </div>
          <p className="text-sm text-gray-600">Based on your preferences</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">About</h4>
            <p className="text-sm text-gray-600">{peer.bio}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {peer.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium capitalize">{peer.experienceLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sessions:</span>
              <span className="font-medium">{peer.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating:</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{peer.rating}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Style:</span>
              <span className="font-medium capitalize">{peer.communicationStyle}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Support Areas</h4>
            <div className="flex flex-wrap gap-2">
              {peer.supportTypes.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
            <div className="flex flex-wrap gap-2">
              {peer.availability.map((time) => (
                <span
                  key={time}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                >
                  {time}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Timezone: {peer.timezone}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">Privacy Guarantee</span>
          </div>
          <p className="text-sm text-green-700">
            Your conversation will be completely private and encrypted. Neither of you can see 
            real identities or personal information.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onConnect}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start Conversation</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PeerMatching
