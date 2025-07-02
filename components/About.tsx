export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About LearnTechLab</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're dedicated to bridging the gap between academic learning and industry requirements. 
            Our mission is to provide aspiring engineers with practical, hands-on experience in AI-Powered Software Development, 
            DevOps, cloud technologies, automation, and modern development practices for the future of technology.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">500+</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Students Trained</h3>
            <p className="text-gray-600">Successfully completed our programs</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">95%</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Placement</h3>
            <p className="text-gray-600">Of our graduates find employment</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">50+</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Partner Companies</h3>
            <p className="text-gray-600">Actively hiring our interns</p>
          </div>
        </div>
      </div>
    </section>
  )
}