import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Heart, 
  Shield, 
  Plus, 
  TrendingUp, 
  Gift, 
  Clock, 
  Target,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'
import zkFundraising, { FundraisingCampaign, AnonymousDonation } from '../lib/midnight/zkFundraising'
import { zkAuth } from '../lib/midnight/zkAuthentication'

const FinancialHelp = () => {
  const [campaigns, setCampaigns] = useState<FundraisingCampaign[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<FundraisingCampaign | null>(null)
  const [loading, setLoading] = useState(false)
  const [userIdentity, setUserIdentity] = useState<any>(null)

  // Create campaign form
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    category: 'therapy' as 'therapy' | 'medication' | 'crisis' | 'general',
    durationDays: 30
  })

  // Donation form
  const [donation, setDonation] = useState({
    amount: 0,
    message: '',
    donorSecret: ''
  })

  useEffect(() => {
    loadCampaigns()
    loadUserIdentity()
  }, [])

  const loadCampaigns = () => {
    const allCampaigns = zkFundraising.getCampaigns()
    setCampaigns(allCampaigns)
  }

  const loadUserIdentity = async () => {
    const identity = await zkAuth.getIdentity()
    setUserIdentity(identity)
    if (identity) {
      setDonation(prev => ({ ...prev, donorSecret: identity.secret }))
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCategory === 'all' || campaign.category === selectedCategory
  )

  const handleCreateCampaign = async () => {
    if (!userIdentity) {
      alert('Please create an identity first')
      return
    }

    if (!newCampaign.title || !newCampaign.description || newCampaign.targetAmount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await zkFundraising.createCampaign(
        newCampaign.title,
        newCampaign.description,
        newCampaign.targetAmount,
        newCampaign.category,
        userIdentity.id,
        true,
        newCampaign.durationDays
      )

      setShowCreateModal(false)
      setNewCampaign({
        title: '',
        description: '',
        targetAmount: 0,
        category: 'therapy',
        durationDays: 30
      })
      loadCampaigns()
    } catch (error) {
      console.error('Failed to create campaign:', error)
      alert('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!selectedCampaign || !userIdentity) return

    if (donation.amount <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    setLoading(true)
    try {
      await zkFundraising.makeDonation({
        amount: donation.amount,
        campaignId: selectedCampaign.id,
        donorSecret: donation.donorSecret,
        message: donation.message
      })

      setShowDonateModal(false)
      setDonation({
        amount: 0,
        message: '',
        donorSecret: userIdentity.secret
      })
      loadCampaigns()
      alert('Donation successful! Your contribution has been made anonymously.')
    } catch (error) {
      console.error('Failed to make donation:', error)
      alert('Failed to make donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'therapy': return Heart
      case 'medication': return Plus
      case 'crisis': return AlertCircle
      default: return DollarSign
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'therapy': return 'text-blue-600 bg-blue-100'
      case 'medication': return 'text-green-600 bg-green-100'
      case 'crisis': return 'text-red-600 bg-red-100'
      default: return 'text-purple-600 bg-purple-100'
    }
  }

  const categories = [
    { id: 'all', name: 'All Categories', icon: DollarSign },
    { id: 'therapy', name: 'Therapy', icon: Heart },
    { id: 'medication', name: 'Medication', icon: Plus },
    { id: 'crisis', name: 'Crisis Support', icon: AlertCircle },
    { id: 'general', name: 'General Support', icon: Users }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Anonymous Financial Help</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extend helping hands to those in need. Support mental health recovery through private donations 
            and receive assistance while maintaining complete anonymity.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(zkFundraising.getTotalDonated())}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-600">{zkFundraising.getTotalCampaigns()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{zkFundraising.getSuccessfulCampaigns()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anonymous Donors</p>
                <p className="text-2xl font-bold text-purple-600">{zkFundraising.getDonations().length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Request Financial Help</span>
          </button>

          <button
            onClick={() => {
              if (filteredCampaigns.length > 0) {
                setSelectedCampaign(filteredCampaigns[0])
                setShowDonateModal(true)
              }
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Gift className="w-5 h-5" />
            <span>Make Anonymous Donation</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, index) => {
            const CategoryIcon = getCategoryIcon(campaign.category)
            const progress = getProgressPercentage(campaign.currentAmount, campaign.targetAmount)
            const daysLeft = Math.max(0, Math.ceil((new Date(campaign.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(campaign.category)}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft}d left</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-900">{formatAmount(campaign.currentAmount)}</span>
                    <span className="text-sm text-gray-600">of {formatAmount(campaign.targetAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{campaign.donations.length} donors</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setShowDonateModal(true)
                    }}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Donate</span>
                  </button>
                </div>

                {/* Milestones */}
                {campaign.milestones.some(m => m.reached) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {campaign.milestones.filter(m => m.reached).map(milestone => (
                        <div key={milestone.id} className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>{milestone.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">Be the first to create a campaign in this category.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Financial Help</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Help with therapy sessions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your situation and how the funds will help..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                <input
                  type="number"
                  value={newCampaign.targetAmount}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newCampaign.category}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="therapy">Therapy</option>
                  <option value="medication">Medication</option>
                  <option value="crisis">Crisis Support</option>
                  <option value="general">General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={newCampaign.durationDays}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Make Anonymous Donation</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-1">{selectedCampaign.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedCampaign.description}</p>
              <div className="flex justify-between text-sm">
                <span>Progress: {formatAmount(selectedCampaign.currentAmount)} / {formatAmount(selectedCampaign.targetAmount)}</span>
                <span>{getProgressPercentage(selectedCampaign.currentAmount, selectedCampaign.targetAmount).toFixed(1)}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount ($)</label>
                <input
                  type="number"
                  value={donation.amount}
                  onChange={(e) => setDonation(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Message</label>
                <textarea
                  value={donation.message}
                  onChange={(e) => setDonation(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Send an anonymous message of support..."
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Privacy Protection</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Your donation will be completely anonymous. Zero-knowledge proofs ensure your identity and amount remain private.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDonateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Donate Anonymously'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FinancialHelp
