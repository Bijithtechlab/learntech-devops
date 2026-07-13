'use client'
import { useState, useEffect } from 'react'
import { getCourseById } from '@/data/courses'
import { aiDevOpsSyllabus, smartCodingSyllabus, vibeCodingAwsSyllabus } from '@/data/syllabus'
import Link from 'next/link'
import { Clock, Users, Award, CheckCircle, BookOpen, Star, ChevronDown, ChevronUp, Briefcase } from 'lucide-react'
import { notFound } from 'next/navigation'
import SyllabusModal from '@/components/SyllabusModal'

interface CourseDetailPageProps {
  params: {
    courseId: string
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [showSyllabus, setShowSyllabus] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showFullOutcomes, setShowFullOutcomes] = useState(false)
  const [liveStatus, setLiveStatus] = useState<string | null>(null)
  const course = getCourseById(params.courseId)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const match = data.courses.find((c: any) => c.courseId === params.courseId)
          if (match?.status) setLiveStatus(match.status)
        }
      })
      .catch(() => {})
  }, [params.courseId])

  if (!course) {
    notFound()
  }

  const status = liveStatus || course.status

  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{course.title}</h1>
              {status === 'coming-soon' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Coming Soon
                </span>
              )}
              {status === 'completed' && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Completed
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.category}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 min-w-0">
              <h2 className="text-xl font-semibold mb-4">Course Description</h2>
              <div className="text-gray-600 mb-6 leading-relaxed space-y-4">
                {showFullDescription ? (
                  // Full description
                  <>
                    {course.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-justify" dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                    ))}
                    <button 
                      onClick={() => setShowFullDescription(false)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                    >
                      Read Less <ChevronUp className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  // Truncated description
                  <>
                    <p className="text-justify" dangerouslySetInnerHTML={{ __html: course.description.split('\n')[0] }}></p>
                    <button 
                      onClick={() => setShowFullDescription(true)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                    >
                      Read More <ChevronDown className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {course.id !== 'smart-coding-revolution' && course.id !== 'Vibe_AWS_AI' && (
                <>
                  <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                  <ul className="space-y-3 mb-6">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {course.id === 'Vibe_AWS_AI' && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Course Outcomes</h2>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">Vibe Coding Mastery</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>AI-First Development:</strong> Build full-stack applications by describing features in natural language to Amazon Q Developer</li>
                        <li><strong>Prompt Engineering:</strong> Master the art of writing precise prompts that generate production-ready code</li>
                        <li><strong>Multi-Mode Proficiency:</strong> Use Chat, Inline, /dev, and @workspace modes for different development scenarios</li>
                      </ul>
                    </div>
                    
                    {!showFullOutcomes ? (
                      <button 
                        onClick={() => setShowFullOutcomes(true)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        Read More <ChevronDown className="h-4 w-4" />
                      </button>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-green-800 mb-3">Full-Stack Development</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Next.js 14:</strong> Build complete applications with file-based routing, API routes, and TypeScript</li>
                            <li><strong>React & Tailwind CSS:</strong> Create responsive, modern UIs with component-based architecture</li>
                            <li><strong>Database Integration:</strong> Design schemas and build CRUD APIs with RDS and DynamoDB</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-orange-800 mb-3">AWS Cloud Skills</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>IAM & Security:</strong> Create users, policies, and roles following security best practices</li>
                            <li><strong>Serverless:</strong> Build and deploy Lambda functions with API Gateway triggers</li>
                            <li><strong>Deployment:</strong> Deploy full-stack apps to AWS Amplify with CI/CD pipelines</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-purple-800 mb-3">Professional Workflow</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Git & GitHub:</strong> Feature branch workflow, commits, merges, and collaboration</li>
                            <li><strong>Iterative Development:</strong> Describe → Review → Test → Iterate → Commit → Repeat</li>
                            <li><strong>Debugging with AI:</strong> Diagnose and fix runtime errors, UI issues, and API failures</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-teal-800 mb-3">Real Projects</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Expense Tracker:</strong> Full-featured app with auth, transactions, reports, budgets, and CSV export</li>
                            <li><strong>Personal Blog Platform:</strong> Independent capstone project designed and deployed by you</li>
                            <li><strong>Live Deployment:</strong> Both projects deployed and accessible on the internet via AWS Amplify</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-lg p-4 mt-4">
                          <p className="text-center text-violet-800 font-semibold">
                            Graduates will be able to <strong>build and deploy full-stack web applications by talking to AI</strong>, with deep understanding of AWS cloud services — ready for modern development roles.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => setShowFullOutcomes(false)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                          Read Less <ChevronUp className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {course.id === 'smart-coding-revolution' && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Course Outcomes</h2>
                  <div className="space-y-4 mb-6">
                    {/* First section always visible */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">AI-Assisted Development Mastery</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Effortless Code Generation:</strong> Students can describe functionality in natural language and generate working code instantly</li>
                        <li><strong>Intelligent Code Completion:</strong> Ability to write partial code and let AI complete complex logic patterns</li>
                        <li><strong>Context-Aware Programming:</strong> Understanding how to provide proper context to AI for accurate code suggestions</li>
                      </ul>
                    </div>
                    
                    {!showFullOutcomes ? (
                      <button 
                        onClick={() => setShowFullOutcomes(true)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                      >
                        Read More <ChevronDown className="h-4 w-4" />
                      </button>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-purple-800 mb-3">Rapid Prototyping Skills</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>10x Faster Development:</strong> Build full-stack applications in days instead of weeks</li>
                            <li><strong>Instant Feature Implementation:</strong> Add new features through conversational prompts with AI</li>
                            <li><strong>Real-time Problem Solving:</strong> Debug issues by simply describing the problem to AI assistants</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-green-800 mb-3">No-Code to Pro-Code Bridge</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Visual-to-Code Translation:</strong> Convert ideas and wireframes directly into functional code</li>
                            <li><strong>Requirement-to-Implementation:</strong> Transform business requirements into working applications without traditional coding barriers</li>
                            <li><strong>Iterative Development:</strong> Rapidly modify and enhance applications through AI-guided iterations</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-orange-800 mb-3">Modern Development Workflow</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>AI-First Approach:</strong> Think in terms of prompts and AI collaboration rather than manual coding</li>
                            <li><strong>Intelligent Debugging:</strong> Use AI to identify, explain, and fix bugs automatically</li>
                            <li><strong>Code Optimization:</strong> Leverage AI to improve performance and code quality continuously</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-teal-800 mb-3">Productivity Multipliers</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Reduced Learning Curve:</strong> Master complex frameworks like Next.js and React without deep syntax knowledge</li>
                            <li><strong>Instant Documentation:</strong> Generate code comments, documentation, and explanations automatically</li>
                            <li><strong>Pattern Recognition:</strong> AI helps identify and implement best practices and design patterns</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Creative Problem Solving</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Experimental Coding:</strong> Quickly test multiple approaches and solutions with AI assistance</li>
                            <li><strong>Feature Exploration:</strong> Discover new possibilities by asking AI "what if" questions</li>
                            <li><strong>Innovation Acceleration:</strong> Focus on creativity and logic rather than syntax memorization</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-indigo-800 mb-3">Professional Vibe Coding Capabilities</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Client Communication:</strong> Translate client requirements directly into working prototypes</li>
                            <li><strong>Rapid MVP Development:</strong> Build minimum viable products in record time</li>
                            <li><strong>Continuous Enhancement:</strong> Easily add features, fix issues, and optimize based on feedback</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-rose-800 mb-3">Future-Ready Mindset</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>AI Collaboration Skills:</strong> Work alongside AI as a development partner, not just a tool</li>
                            <li><strong>Adaptability:</strong> Quickly learn new technologies and frameworks with AI assistance</li>
                            <li><strong>Efficiency Focus:</strong> Prioritize results and functionality over traditional coding complexity</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Unique Market Position</h3>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Hybrid Developer:</strong> Combine traditional programming knowledge with AI-powered efficiency</li>
                            <li><strong>Innovation Catalyst:</strong> Bring ideas to life faster than conventional developers</li>
                            <li><strong>Technology Translator:</strong> Bridge the gap between business needs and technical implementation</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-lg p-4 mt-4">
                          <p className="text-center text-violet-800 font-semibold">
                            Students will emerge as <strong>"Vibe Coders"</strong> who can think, create, and build at the speed of thought, making them highly sought-after in a market that increasingly values rapid delivery and innovation over traditional coding approaches.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => setShowFullOutcomes(false)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                          Read Less <ChevronUp className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {(course.id === 'ai-devops-cloud' || course.id === 'smart-coding-revolution' || course.id === 'Vibe_AWS_AI') && (
                <>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 sm:p-6 mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-6 w-6 text-yellow-600" />
                      <h3 className="text-xl font-bold text-yellow-800">Exclusive Internship Opportunity!</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      This course makes you <strong>eligible for our highly selective internship program!</strong> Get real-world experience and direct pathway to employment.
                    </p>
                    <Link
                      href={`/internship?courseId=${course.id}`}
                      className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                    >
                      <Star className="h-5 w-5" />
                      View Internship Details
                    </Link>
                  </div>
                  
                  {course.id === 'ai-devops-cloud' && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowSyllabus(true)}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <BookOpen className="h-5 w-5" />
                        View Detailed Syllabus
                      </button>
                    </div>
                  )}
                  
                  {(course.id === 'smart-coding-revolution' || course.id === 'Vibe_AWS_AI') && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowSyllabus(true)}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <BookOpen className="h-5 w-5" />
                        View Detailed Syllabus
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="md:col-span-1 min-w-0">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:sticky md:top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{course.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-600">Course Fee</div>
                </div>

                <div className="space-y-3">
                  {status === 'active' && (
                    <Link
                      href={`/register/${course.id}`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                    >
                      Register Now
                    </Link>
                  )}
                  {status === 'coming-soon' && (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                  {status === 'completed' && (
                    <button
                      disabled
                      className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Course Completed
                    </button>
                  )}
                  
                  <Link
                    href="/courses"
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center block"
                  >
                    View All Courses
                  </Link>
                </div>

                {course.id === 'ai-devops-cloud' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Course Schedule</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div>
                        <span className="font-medium">Mode:</span>
                        <span className="ml-1">Online Classes</span>
                      </div>
                      <div>
                        <span className="font-medium">Days:</span>
                        <span className="ml-1">Mon, Wed, Thu, Fri</span>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <span className="ml-1">04:30-06:30 PM IST</span>
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>
                        <span className="ml-1">01-Sep-2025</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {(course.id === 'smart-coding-revolution' || course.id === 'Vibe_AWS_AI') && (
                  <>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                      <ul className="space-y-2">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">Course Schedule</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div>
                          <span className="font-medium">Mode:</span>
                          <span className="ml-1">Online</span>
                        </div>
                        <div>
                          <span className="font-medium">Days:</span>
                          <span className="ml-1">{course.id === 'Vibe_AWS_AI' ? 'Mon, Tue, Wed, Thu' : 'Mon, Tue, Wed, Thu, Fri'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>
                          <span className="ml-1">{course.id === 'Vibe_AWS_AI' ? '07:00-09:00 PM IST' : '06:30-08:30 PM IST'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">{course.id === 'Vibe_AWS_AI' ? '4 weeks (17 sessions, ~2 hours each)' : '15 days'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Start:</span>
                          <span className="ml-1">{course.id === 'Vibe_AWS_AI' ? 'Coming Soon' : '05-Jan-2026'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {course.id === 'ai-devops-cloud' && (
          <SyllabusModal
            isOpen={showSyllabus}
            onClose={() => setShowSyllabus(false)}
            syllabus={aiDevOpsSyllabus}
            courseTitle={course.title}
          />
        )}
        
        {course.id === 'smart-coding-revolution' && (
          <SyllabusModal
            isOpen={showSyllabus}
            onClose={() => setShowSyllabus(false)}
            syllabus={smartCodingSyllabus}
            courseTitle={course.title}
          />
        )}
        
        {course.id === 'Vibe_AWS_AI' && (
          <SyllabusModal
            isOpen={showSyllabus}
            onClose={() => setShowSyllabus(false)}
            syllabus={vibeCodingAwsSyllabus}
            courseTitle={course.title}
          />
        )}
      </div>
    </div>
  )
}