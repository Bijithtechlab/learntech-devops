import { Award, Users, BookOpen, CheckCircle } from 'lucide-react'

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Meet Our Esteemed Trainers</h1>
          <p className="text-xl opacity-90">Industry Veterans with 50+ Years Combined Experience</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trainer 1: Vinod Kumar */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold">VK</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Vinod Kumar</h2>
                <p className="text-blue-100 mb-4">Senior IT Training Specialist</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <Award className="h-4 w-4 mr-2" />
                    <span>39+ Years Experience</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>15,000+ Students Trained</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">A Veteran in IT Training with 39+ Years of Unmatched Experience</h3>
              <p className="text-gray-600 mb-6">
                Vinod Kumar is a distinguished professional in Networking and System Administration, bringing nearly four decades of profound industry experience to our training programs. His extensive expertise spans the entire IT landscape, from foundational technologies to modern essentials including Python, Java, Full Stack Development, and comprehensive database management.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Certifications</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />CCNA Certified</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />CCNP Certified</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />JNCIS-ER Certified</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Expertise Areas</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Networking & System Admin</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Python & Java Development</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Database Management</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Proven Success Record</h4>
                <p className="text-green-700 text-sm">
                  Students consistently placed in leading IT companies including Infosys, TCS, HCL, Genpact, and Hexaware. 
                  Active corporate trainer and university collaborator with hands-on project leadership experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer 2: Bijith */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold">BK</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Bijith Meethale Kondayattu</h2>
                <p className="text-purple-100 mb-4">AI & Cloud Technology Expert</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <Award className="h-4 w-4 mr-2" />
                    <span>PMP®, CPMAI® Certified</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>14+ Years International Experience</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI & Technology Expert with Global Experience</h3>
              <p className="text-gray-600 mb-6">
                A highly experienced technology trainer and certified project management professional with over 14 years of international expertise in delivering advanced data analytics, AI, and healthcare IT projects across Asia, Europe, and the Middle East. Specializes in AI-assisted application development and cutting-edge cloud technologies.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />PMP®</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />CPMAI®</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />AWS Solution Architect - SAA-C03</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />AWS Cloud Practitioner - CLF-C02</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">AI & LLM Expertise</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-500 mr-2" />Generative AI (GenAI)</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-500 mr-2" />Claude-3, Gemini, GPT-4</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-500 mr-2" />Multi AI Agent Systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cloud & Development</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />AWS Solution Architect</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />AWS Q Developer</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Full-Stack Development</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">AI Development Impact</h4>
                <p className="text-purple-700 text-sm">
                  Achieved up to 60% reduction in development time using AI-assisted methods. 
                  Pioneered GenAI tools for accelerating development cycles and automating project workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Combined Training Excellence</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-blue-100">Years Combined Experience</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <p className="text-blue-100">Students Trained</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-blue-100">Industry-Relevant Curriculum</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Mentorship Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}