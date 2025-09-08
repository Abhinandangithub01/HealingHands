import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, User, CheckCircle, Loader, ArrowLeft } from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'

const Authentication = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [identity, setIdentity] = useState<any>(null)
  const [selectedCondition, setSelectedCondition] = useState('')

  const conditions = [
    { id: 'anxiety', name: 'Anxiety Support', description: 'General anxiety, panic attacks, social anxiety' },
    { id: 'depression', name: 'Depression Support', description: 'Depression, mood disorders, low mood' },
    { id: 'general', name: 'General Support', description: 'General mental health support and wellness' }
  ]

  const handleCreateIdentity = async () => {
    setLoading(true)
    try {
      // Generate anonymous ZK identity
      const newIdentity = await zkAuth.createIdentity()
      setIdentity(newIdentity)
      setStep(2)
    } catch (error) {
      console.error('Failed to create identity:', error)
      alert('Failed to create identity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCondition = async () => {
    if (!selectedCondition) return
    
    setLoading(true)
    try {
      // Generate ZK proof for condition verification
      const verificationResult = await zkAuth.verifyCondition(selectedCondition)
      if (verificationResult) {
        setStep(3)
      } else {
        alert('Verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Failed to verify condition:', error)
      alert('Failed to verify condition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Identity Creation */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Anonymous Identity</h2>
              <p className="text-gray-600 mb-8">
                Generate a secure, anonymous identity using zero-knowledge cryptography. 
                No personal information is stored or shared.
              </p>

              <button
                onClick={handleCreateIdentity}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Identity...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Generate ZK Identity</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Condition Verification */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Support Need</h2>
              <p className="text-gray-600 mb-8">
                Select your support area. This creates a private proof without revealing 
                personal details to anyone, including us.
              </p>

              <div className="space-y-3 mb-8">
                {conditions.map((condition) => (
                  <button
                    key={condition.id}
                    onClick={() => setSelectedCondition(condition.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${
                      selectedCondition === condition.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{condition.name}</div>
                    <div className="text-sm text-gray-600">{condition.description}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleVerifyCondition}
                disabled={!selectedCondition || loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Proof...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Create Private Proof</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 3: Completion */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Identity Created Successfully</h2>
              <p className="text-gray-600 mb-4">
                Your anonymous identity: <span className="font-mono text-blue-600">{identity?.username}</span>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Your identity is completely private and cannot be traced back to you. 
                You can now join support groups safely.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                <div className="flex items-center space-x-2 text-green-700">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Privacy Protected</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  End-to-end encryption • Zero-knowledge proofs • Anonymous messaging
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Continue to Profile</span>
              </button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default Authentication
