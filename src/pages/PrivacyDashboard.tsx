import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Code, 
  Server, 
  Key, 
  FileText, 
  Globe, 
  ArrowLeft,
  ExternalLink,
  Download,
  GitBranch,
  Cpu,
  Database,
  Network,
  BarChart3,
  Activity
} from 'lucide-react'

const PrivacyDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-12 bg-blue-50">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Privacy Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand exactly how your privacy is protected through advanced zero-knowledge cryptography.
            No personal information ever leaves your device.
          </p>
        </motion.div>

        {/* Privacy Status Overview */}
        <PrivacyStatusOverview />

        {/* ZK Circuits Showcase */}
        <ZKCircuitsShowcase />

        {/* How Zero-Knowledge Works */}
        <ZeroKnowledgeExplanation />

        {/* What's Protected */}
        <WhatsProtected />

        {/* Technical Details */}
        <TechnicalDetails />

        {/* Privacy Guarantees */}
        <PrivacyGuarantees />
      </div>
    </div>
  )
}

const PrivacyStatusOverview = () => {
  const statusItems = [
    {
      icon: Shield,
      title: "Identity Protection",
      status: "Active",
      description: "Your real identity is mathematically anonymous",
      color: "blue"
    },
    {
      icon: Lock,
      title: "Data Encryption",
      status: "E2E Encrypted",
      description: "All communications use end-to-end encryption",
      color: "green"
    },
    {
      icon: Eye,
      title: "Zero Data Collection",
      status: "Verified",
      description: "No personal data stored on our servers",
      color: "blue"
    },
    {
      icon: Zap,
      title: "ZK Proofs",
      status: "Operational",
      description: "Zero-knowledge verification active",
      color: "green"
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Current Privacy Status
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${item.color}-100`}>
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 bg-${item.color}-100 text-${item.color}-700`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {item.status}
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

const ZKCircuitsShowcase = () => {
  const zkCircuits = [
    {
      name: "Mental Health Verification",
      description: "Verify mental health conditions without revealing sensitive information",
      compliance: "HIPAA, GDPR",
      icon: Shield
    },
    {
      name: "Medical History Verification",
      description: "Verify medical history without revealing sensitive information",
      compliance: "HIPAA, GDPR",
      icon: Lock
    },
    {
      name: "Genetic Data Verification",
      description: "Verify genetic data without revealing sensitive information",
      compliance: "HIPAA, GDPR",
      icon: Eye
    },
    {
      name: "Identity Verification",
      description: "Verify identity without revealing sensitive information",
      compliance: "KYC, AML",
      icon: Users
    },
    {
      name: "Location Verification",
      description: "Verify location without revealing sensitive information",
      compliance: "GDPR, CCPA",
      icon: Globe
    },
    {
      name: "Device Verification",
      description: "Verify device without revealing sensitive information",
      compliance: "GDPR, CCPA",
      icon: Cpu
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        ZK Circuits Showcase
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zkCircuits.map((circuit, index) => (
          <motion.div
            key={circuit.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-blue-100">
              <circuit.icon className="w-6 h-6 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{circuit.name}</h3>
            <p className="text-sm text-gray-600">{circuit.description}</p>
            <p className="text-sm text-gray-600 mt-2">Compliance: {circuit.compliance}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

const ZeroKnowledgeExplanation = () => {
  const steps = [
    {
      step: 1,
      title: "Your Data Stays Private",
      description: "Your medical condition, severity, and personal details never leave your device. They're encrypted locally.",
      icon: Lock
    },
    {
      step: 2,
      title: "Generate Mathematical Proof",
      description: "Your device creates a zero-knowledge proof that you meet group requirements without revealing what those requirements are.",
      icon: Zap
    },
    {
      step: 3,
      title: "Anonymous Verification",
      description: "The network verifies your proof and grants access to compatible groups, but learns nothing about you personally.",
      icon: Shield
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <div className="bg-blue-50 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How Zero-Knowledge Privacy Works
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-center mb-12 last:mb-0"
            >
              <div className={`flex-shrink-0 mb-6 md:mb-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8 md:order-2'}`}>
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
              </div>
              
              <div className={`flex-1 text-center md:text-left ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

const WhatsProtected = () => {
  const protectedData = [
    {
      category: "Medical Information",
      items: [
        "Specific mental health conditions",
        "Severity levels and symptoms",
        "Treatment history and duration",
        "Medication information",
        "Therapy details"
      ],
      icon: Shield,
      color: "blue"
    },
    {
      category: "Personal Identity",
      items: [
        "Real name and contact info",
        "Location and address",
        "Age and demographic data",
        "Social media profiles",
        "Professional information"
      ],
      icon: Lock,
      color: "green"
    },
    {
      category: "Communication Data",
      items: [
        "Message content (encrypted)",
        "Conversation partners",
        "Communication patterns",
        "Online activity times",
        "Device information"
      ],
      icon: Eye,
      color: "blue"
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        What's Protected
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {protectedData.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-${category.color}-100`}>
              <category.icon className={`w-6 h-6 text-${category.color}-600`} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
            
            <ul className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 text-${category.color}-500`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

const TechnicalDetails = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Technical Implementation
      </h2>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              Zero-Knowledge Circuits
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Compact Language:</strong> Mental health verification circuits written in Midnight's Compact language</p>
              <p><strong>Proof Generation:</strong> Client-side proof creation using MidnightJS SDK</p>
              <p><strong>Verification:</strong> On-chain verification without revealing private inputs</p>
              <p><strong>Sybil Protection:</strong> Anonymous identity commitments prevent duplicate accounts</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              Encryption & Security
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>End-to-End Encryption:</strong> All messages encrypted before leaving your device</p>
              <p><strong>Perfect Forward Secrecy:</strong> New encryption keys for each session</p>
              <p><strong>Anonymous Routing:</strong> Message routing without revealing sender/receiver</p>
              <p><strong>Secure Storage:</strong> Local encrypted storage only, no server-side data</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Open Source & Auditable</h4>
              <p className="text-sm text-blue-700">
                All cryptographic implementations are open source and have been audited by security experts. 
                You can verify the code yourself on GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

const PrivacyGuarantees = () => {
  const navigate = useNavigate();
  const guarantees = [
    {
      title: "Mathematical Anonymity",
      description: "Your anonymity is guaranteed by mathematics, not just policies. Zero-knowledge proofs make it cryptographically impossible to reveal your identity.",
      icon: Shield,
      level: "Absolute"
    },
    {
      title: "No Data Collection",
      description: "We don't collect, store, or have access to your personal information. Everything stays on your device.",
      icon: Eye,
      level: "Verified"
    },
    {
      title: "Decentralized Architecture",
      description: "Built on Midnight Network's decentralized infrastructure. No single point of failure or control.",
      icon: Users,
      level: "Distributed"
    },
    {
      title: "Regulatory Compliance",
      description: "Exceeds HIPAA, GDPR, and other privacy regulations through technical implementation, not just policies.",
      icon: CheckCircle,
      level: "Compliant"
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Privacy Guarantees
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {guarantees.map((guarantee, index) => (
          <motion.div
            key={guarantee.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <guarantee.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{guarantee.title}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {guarantee.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{guarantee.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl">
          <Shield className="w-5 h-5 mr-2" />
          <span className="font-semibold">Your privacy is mathematically guaranteed</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => navigate('/privacy-statistics')}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <BarChart3 className="w-5 h-5" />
          View Privacy Statistics
        </button>
        <button 
          onClick={() => navigate('/privacy-metrics')}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Activity className="w-5 h-5" />
          Live Privacy Metrics
        </button>
      </div>
    </motion.section>
  )
}

export default PrivacyDashboard
