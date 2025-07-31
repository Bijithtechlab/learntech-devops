'use client'
import { useState, useEffect } from 'react'
import { User, Mail, Phone, Lock, GraduationCap, Building, MessageSquare } from 'lucide-react'

interface CognitoRegistrationProps {
  courseId: string
  courseName: string
}

export default function CognitoRegistration({ courseId, courseName }: CognitoRegistrationProps) {
  const [step, setStep] = useState(1)
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [configReady, setConfigReady] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    education: '',
    collegeName: '',
    motivation: '',
    referredBy: ''
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    // Clear form data on component mount
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      education: '',
      collegeName: '',
      motivation: '',
      referredBy: ''
    })
    
    // Dynamic import to avoid SSR issues
    const initializeAmplify = async () => {
      try {
        const { Amplify } = await import('aws-amplify')
        const config = {
          Auth: {
            Cognito: {
              userPoolId: 'ap-south-1_5bmOBtUaw',
              userPoolClientId: '3t3qb2mff70p5m2rob38pbuss8',
            },
          },
        }
        Amplify.configure(config)
        
        // Sign out any existing user
        try {
          const { signOut } = await import('aws-amplify/auth')
          await signOut()
        } catch (error) {
          // Ignore sign out errors (user might not be signed in)
        }
        
        setConfigReady(true)
      } catch (error) {
        console.error('Failed to initialize Amplify:', error)
        setErrors({ general: 'Failed to initialize registration system' })
      }
    }
    
    initializeAmplify()
  }, [])

  if (!configReady) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Initializing registration system...</p>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors: any = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: any = {}
    if (!formData.education) newErrors.education = 'Education level is required'
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkUserExists = async () => {
    try {
      const response = await fetch(`https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/register?email=${formData.email}`, {
        method: 'GET'
      })
      const result = await response.json()
      return result.exists
    } catch (error) {
      return false
    }
  }

  const checkCourseRegistration = async () => {
    try {
      const url = `https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/register`
      console.log('Checking course registration with URL:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'checkDuplicate',
          email: formData.email,
          courseId: courseId
        })
      })
      
      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText)
        return false
      }
      
      const result = await response.json()
      console.log('Course registration check response:', result)
      
      return result.success && result.registered === true
    } catch (error) {
      console.error('Error checking course registration:', error)
      throw error
    }
  }

  const checkDuplicateRegistration = async () => {
    if (!validateStep1()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      console.log('Checking duplicate registration for:', formData.email, 'courseId:', courseId)
      
      // Check if user already registered for this specific course
      const alreadyRegistered = await checkCourseRegistration()
      console.log('Already registered result:', alreadyRegistered)
      
      if (alreadyRegistered === true) {
        console.log('User already registered, showing error screen')
        setShowAlreadyRegistered(true)
        setLoading(false)
        return
      }
      
      // Check if user already registered for any course
      const userExists = await checkUserExists()
      console.log('User exists result:', userExists)
      
      if (userExists === true) {
        // Existing user - show confirmation and go to step 2
        setIsExistingUser(true)
      }
      
      // Proceed to step 2
      setStep(2)
      
    } catch (error: any) {
      console.error('Error in checkDuplicateRegistration:', error)
      setErrors({ general: `Error checking registration: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!validateStep2()) return
    
    setLoading(true)
    try {
      if (isExistingUser) {
        // Existing user - directly register for course
        try {
          await saveRegistrationToDynamoDB()
          setStep(4)
        } catch (error: any) {
          setErrors({ general: error.message })
          return
        }
      } else {
        // New user - create Cognito account
        try {
          const { signUp } = await import('aws-amplify/auth')
          await signUp({
            username: formData.email,
            password: formData.password,
            options: {
              userAttributes: {
                email: formData.email,
                given_name: formData.firstName,
                family_name: formData.lastName
              }
            }
          })
          setStep(3)
        } catch (cognitoError: any) {
          if (cognitoError.name === 'UsernameExistsException') {
            // User exists in Cognito but not in our DB - register for course
            setIsExistingUser(true)
            try {
              await saveRegistrationToDynamoDB()
              setStep(4)
            } catch (dbError: any) {
              setErrors({ general: dbError.message })
              return
            }
          } else {
            throw cognitoError
          }
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    if (!verificationCode) {
      setErrors({ verification: 'Verification code is required' })
      return
    }
    
    setLoading(true)
    try {
      const { confirmSignUp, signIn } = await import('aws-amplify/auth')
      await confirmSignUp({
        username: formData.email,
        confirmationCode: verificationCode
      })
      
      // Auto sign in after verification
      await signIn({
        username: formData.email,
        password: formData.password
      })
      
      // Save registration to DynamoDB
      try {
        await saveRegistrationToDynamoDB()
        setStep(4)
      } catch (error: any) {
        setErrors({ verification: error.message })
        return
      }
    } catch (error: any) {
      setErrors({ verification: error.message })
    } finally {
      setLoading(false)
    }
  }

  const saveRegistrationToDynamoDB = async () => {
    try {
      const response = await fetch('https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          education: formData.education,
          experience: 'Not specified',
          motivation: formData.motivation,
          referredBy: formData.referredBy || 'Not specified',
          collegeName: formData.collegeName || 'Not specified',
          courseId: courseId,
          courseName: courseName,
          emailVerified: true,
          registrationMethod: 'cognito'
        })
      })
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message)
      }
    } catch (error) {
      throw error
    }
  }

  const resendCode = async () => {
    setLoading(true)
    try {
      const { resendSignUpCode } = await import('aws-amplify/auth')
      await resendSignUpCode({
        username: formData.email
      })
      alert('Verification code resent to your email')
    } catch (error: any) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (showAlreadyRegistered) {
    return (
      <div className="text-center">
        <div className="text-orange-600 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Already Registered</h1>
        <p className="text-lg text-gray-600 mb-6">
          You've already registered for this course. For further assistance, please contact our team at{' '}
          <a href="mailto:info@learntechlab.com" className="text-blue-600 hover:text-blue-700 font-semibold">
            info@learntechlab.com
          </a>
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-800">
            <strong>Need Help?</strong> Our support team is available to assist you with any questions about your existing registration or course access.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/courses'}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Other Courses
        </button>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="text-center">
        <div className="text-green-600 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
        <p className="text-lg text-gray-600 mb-6">
          {isExistingUser 
            ? <>You have successfully registered for <strong>{courseName}</strong>!</>
            : <>Welcome to <strong>{courseName}</strong>! Your account has been created and verified.</>
          }
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <strong>Next Steps:</strong> Our team will contact you within 24 hours with course access details and payment information.
            {isExistingUser && <span><br/>You can access your existing courses from your dashboard.</span>}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {['Personal Info', 'Background', 'Email Verification', 'Complete'].map((label, index) => (
            <div key={index} className={`text-sm ${
              step > index + 1 ? 'text-green-600' : step === index + 1 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {label}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{errors.general}</p>
        </div>
      )}

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">{isExistingUser ? 'Confirm Your Details' : 'Personal Information'}</h2>
          
          {isExistingUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>Welcome back!</strong> We found your account. Please confirm your details to register for this course.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                autoComplete="off"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a password (min 8 characters)"
                autoComplete="new-password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <button
            onClick={checkDuplicateRegistration}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </div>
      )}

      {/* Step 2: Background Information */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Background Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.education ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College/Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => handleInputChange('collegeName', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter college or company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to take this course? *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.motivation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us about your goals and motivation..."
              />
            </div>
            {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about us?
            </label>
            <input
              type="text"
              value={formData.referredBy}
              onChange={(e) => handleInputChange('referredBy', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Friend, Google, Social Media, etc."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (validateStep2()) handleSignUp()
              }}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Email Verification */}
      {step === 3 && (
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to <strong>{formData.email}</strong>
          </p>
          

          
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={`w-full px-4 py-3 text-center text-2xl font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.verification ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000000"
              maxLength={6}
            />
            {errors.verification && <p className="text-red-500 text-sm mt-1">{errors.verification}</p>}
          </div>

          <button
            onClick={handleVerification}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          
          <button
            onClick={resendCode}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Resend Code
          </button>
        </div>
      )}
    </div>
  )
}