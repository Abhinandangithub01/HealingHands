import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Lock, Heart, Users, AlertCircle } from 'lucide-react'
import { zkAuth } from '../lib/midnight/zkAuthentication'
import { midnightIntegration } from '../lib/midnight/midnightIntegration'
import PrivacyShield from '../components/privacy/PrivacyShield'
import ProgressSteps from '../components/ui/ProgressSteps'

interface ConditionForm {
  condition_category: 'anxiety' | 'depression' | 'trauma' | 'addiction' | 'other'
  severity_level: 1 | 2 | 3 | 4 | 5
  treatment_duration: number
  support_preferences: string[]
  interaction_style: 1 | 2 | 3 // 1=listening, 2=sharing, 3=both
  session_frequency: 1 | 2 | 3 // 1=weekly, 2=biweekly, 3=monthly
  group_size_pref: 1 | 2 | 3 // 1=small, 2=medium, 3=large
  experience_level: 1 | 2 | 3 // 1=new, 2=experienced, 3=mentor
}

const ConditionVerification = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<ConditionForm>({
    condition_category: 'anxiety',
    severity_level: 1,
    treatment_duration: 0,
    support_preferences: [],
    interaction_style: 1,
    session_frequency: 1,
    group_size_pref: 2,
    experience_level: 1
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const generateProof = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Prepare verification inputs
      const verificationInputs = {
        name: 'Anonymous User',
        organization: 'Self',
        role: 'Support Seeker',
        idNumber: 'ANON_' + Date.now(),
        mentalHealthCondition: form.condition_category,
        organizationType: 1, // Individual
        roleType: 1, // Support seeker
        conditionCategory: getCategoryNumber(form.condition_category),
        severityLevel: form.severity_level
      }

      // Create ZK identity with a default passphrase
      const passphrase = 'default_passphrase_' + Date.now()
      const identity = await zkAuth.createIdentity(verificationInputs, passphrase)
      
      console.log('✅ ZK Identity created:', identity.anonymousId)

      // Store user preferences for matching
      localStorage.setItem('user_preferences', JSON.stringify({
        interaction_style: form.interaction_style,
        session_frequency: form.session_frequency,
        group_size_pref: form.group_size_pref,
        experience_level: form.experience_level,
        condition_category: form.condition_category,
        severity_level: form.severity_level,
        treatment_duration: form.treatment_duration,
        anonymousId: identity.anonymousId,
        passphrase: passphrase
      }))

      // Store onboarding completion
      localStorage.setItem('onboarding_completed', 'true')
      localStorage.setItem('current_user_id', identity.anonymousId)

      navigate('/matching')
      
    } catch (error) {
      console.error('Proof generation failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate proof')
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryNumber = (category: string): number => {
    const mapping = { anxiety: 1, depression: 2, trauma: 3, addiction: 4, other: 5 }
    return mapping[category as keyof typeof mapping] || 5
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 max-w-2xl">
        
        <ProgressSteps currentStep={step} totalSteps={3} />
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepOne 
              form={form} 
              setForm={setForm} 
              onNext={() => setStep(2)} 
            />
          )}

          {step === 2 && (
            <StepTwo 
              form={form} 
              setForm={setForm} 
              onNext={() => setStep(3)} 
              onBack={() => setStep(1)} 
            />
          )}

          {step === 3 && (
            <StepThree 
              form={form}
              onBack={() => setStep(2)}
              onGenerateProof={generateProof}
              isLoading={isLoading}
              error={error}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const StepOne = ({ form, setForm, onNext }: {
  form: ConditionForm
  setForm: (form: ConditionForm) => void
  onNext: () => void
}) => {
  const conditions = [
    { id: 'anxiety', name: 'Anxiety & Panic', icon: '😰', description: 'Anxiety disorders, panic attacks, social anxiety' },
    { id: 'depression', name: 'Depression & Mood', icon: '💙', description: 'Depression, bipolar, mood disorders' },
    { id: 'trauma', name: 'Trauma & PTSD', icon: '🛡️', description: 'PTSD, trauma recovery, grief' },
    { id: 'addiction', name: 'Addiction & Recovery', icon: '🌱', description: 'Substance abuse, behavioral addictions' },
    { id: 'other', name: 'Other Conditions', icon: '🤝', description: 'Eating disorders, OCD, other mental health conditions' }
  ]

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-3xl p-8 shadow-lg"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Let's Find Your Safe Space
        </h2>
        <p className="text-gray-600 text-lg">
          We'll help you connect with others who understand, while keeping your personal details completely private.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What type of support are you looking for?</h3>
        
        {conditions.map((condition) => (
          <motion.button
            key={condition.id}
            onClick={() => setForm({ ...form, condition_category: condition.id as any })}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              form.condition_category === condition.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{condition.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </div>
              {form.condition_category === condition.id && (
                <CheckCircle className="w-6 h-6 text-blue-600 ml-auto" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <button 
        onClick={onNext}
        className="w-full mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
      >
        <span>Continue Securely</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

const StepTwo = ({ form, setForm, onNext, onBack }: {
  form: ConditionForm
  setForm: (form: ConditionForm) => void
  onNext: () => void
  onBack: () => void
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-3xl p-8 shadow-lg"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Support Preferences
        </h2>
        <p className="text-gray-600 text-lg">
          Help us find the most compatible support groups for you. This information stays private.
        </p>
      </div>

      <div className="space-y-6">
        {/* Severity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate your current need for support? (1-5 scale)
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setForm({ ...form, severity_level: level as any })}
                className={`flex-1 p-3 rounded-lg border-2 transition-all duration-300 ${
                  form.severity_level === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{level}</div>
                  <div className="text-xs mt-1">
                    {level === 1 ? 'Mild' : level === 2 ? 'Low' : level === 3 ? 'Moderate' : level === 4 ? 'High' : 'Urgent'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How long have you been seeking support? (months)
          </label>
          <input
            type="number"
            min="0"
            max="120"
            value={form.treatment_duration}
            onChange={(e) => setForm({ ...form, treatment_duration: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
            placeholder="Enter number of months"
          />
        </div>

        {/* Interaction Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How do you prefer to participate in support groups?
          </label>
          <div className="space-y-2">
            {[
              { id: 1, name: 'Mostly Listening', desc: 'I prefer to listen and learn from others' },
              { id: 2, name: 'Mostly Sharing', desc: 'I like to share my experiences and help others' },
              { id: 3, name: 'Both Equally', desc: 'I enjoy both listening and sharing' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setForm({ ...form, interaction_style: style.id as any })}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                  form.interaction_style === style.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{style.name}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
                  </div>
                  {form.interaction_style === style.id && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button 
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button 
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

const StepThree = ({ form, onBack, onGenerateProof, isLoading, error }: {
  form: ConditionForm
  onBack: () => void
  onGenerateProof: () => void
  isLoading: boolean
  error: string | null
}) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-3xl p-8 shadow-lg"
    >
      <div className="text-center mb-8">
        <PrivacyShield isActive={true} size="lg" />
        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">
          Generate Your Privacy Shield
        </h2>
        <p className="text-gray-600">
          We'll create a cryptographic proof that you're eligible for support groups without revealing any personal medical information.
        </p>
      </div>

      <PrivacyExplanation />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 inline-flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onGenerateProof}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Privacy Proof...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Find Support Groups</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

const PrivacyExplanation = () => {
  const features = [
    { icon: Lock, text: "Your medical condition stays on your device" },
    { icon: Shield, text: "Zero-knowledge proof verifies eligibility" },
    { icon: Users, text: "Anonymous identity for group matching" }
  ]

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        What happens when you generate your proof:
      </h3>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <feature.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-blue-800 text-sm">{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConditionVerification
