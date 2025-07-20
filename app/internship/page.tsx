import Link from 'next/link'
import { Users, Target, Award, Briefcase, Star, CheckCircle, ArrowRight } from 'lucide-react'

export default function InternshipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Elevate Your Career: learntechlab's Exclusive Internship Program
          </h1>
          <p className="text-xl opacity-90">
            For Future-Ready Engineers!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-lg text-gray-700 leading-relaxed">
               At LearnTechLab, we are committed to bridging the gap between academic learning and industry demands, shaping our students into truly "Future-Ready Engineers." With extensive industry experience and a focus on immersive, practical learning, we're excited to introduce an exclusive, hands-on internship program for graduates of our flagship "AI Powered Software Development - Cloud, Generative AI, & Vibe Coding" course. This internship is the culmination of our promise to provide real-world experience — not just as observers, but as active contributors to meaningful projects. It deepens your understanding of modern development practices and serves as the ultimate application of our industry-relevant, future-focused curriculum.
            </p>
          </div>
        </section>

        {/* Who is This For */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              Eligibility criteria
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                This elite internship opportunity is <strong>highly selective</strong> and offered to a few <strong className="text-yellow-700">qualified students</strong> who have successfully mastered the comprehensive curriculum of our "AI Powered Software Development - Cloud, Generative AI, & Vibe Coding" course. It's the perfect way to transition from intensive, expert-led training to real-world impact.
              </p>
            </div>
          </div>
        </section>

        {/* What Will You Gain */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-600" />
              Expected Learning Achievements
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Our internship is not just an extension of your learning; it's your launchpad into a successful career. You will receive comprehensive hands-on training and:
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apply Your Expertise</h3>
                  <p className="text-gray-700">Directly implement the advanced skills in AI-Powered Software Development, DevOps, and Cloud Technologies that you've mastered. This includes practical experience in AI, GenAI, and machine learning implementation for cloud-based AI solutions.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Work on Real Projects</h3>
                  <p className="text-gray-700">Engage with real projects using modern technologies and industry-standard practices. This means putting your skills in automation, modern development practices, and full-stack development to the test.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receive Expert Mentorship</h3>
                  <p className="text-gray-700">Continue to learn from experienced professionals with years of industry experience, including top-tier experts like Bijith Meethale Kondayattu, our AI & Cloud Technology Expert, who brings 14+ years of international experience in AI, GenAI, and cloud technologies, and Vinod Kumar, our Senior IT Training Specialist with 39+ years of unmatched experience.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Forge Your Career Path</h3>
                  <p className="text-gray-700">This program is designed to prepare you for real-world roles, equipping you with the skills and experience needed to transition smoothly into a rewarding job after your internship.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Your Journey Starts Here!</h2>
            <p className="text-lg mb-8 opacity-90">
              To qualify for this transformative and highly sought-after internship program, your first step is to enroll in and successfully complete our "AI Powered Software Development - Cloud, Generative AI, & Vibe Coding" course. Don't just learn; launch your career with learntechlab.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses/ai-devops-cloud"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Course Details
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register/ai-devops-cloud"
                className="inline-flex items-center gap-2 bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Register Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}