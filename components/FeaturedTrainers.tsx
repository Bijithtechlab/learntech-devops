import Link from 'next/link'
import { Award, Users, ArrowRight } from 'lucide-react'

export default function FeaturedTrainers() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn from Industry Veterans</h2>
          <p className="text-xl text-gray-600">50+ Years Combined Experience Training Future-Ready Engineers</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Vinod Kumar Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                VK
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Vinod Kumar</h3>
                <p className="text-blue-600 font-medium">Senior IT Training Specialist</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              39+ years of unmatched experience in Networking, System Administration, and Full-Stack Development. 
              Successfully trained 15,000+ students with proven placement success.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>15,000+ Students</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-1" />
                <span>CCNA, CCNP Certified</span>
              </div>
            </div>
          </div>

          {/* Bijith Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                BK
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bijith Meethale Kondayattu</h3>
                <p className="text-purple-600 font-medium">AI & Cloud Technology Expert</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              PMP®, CPMAI® certified with 14+ years international experience in AI, GenAI, and cloud technologies. 
              Achieved 60% development time reduction using AI-assisted methods.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-1" />
                <span>PMP®, CPMAI®</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>AWS Certified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/trainers" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Meet Our Complete Team
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}