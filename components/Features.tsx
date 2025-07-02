import { Code, Users, Award } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Code,
      title: 'Hands-on Learning',
      description: 'Work on real projects with modern technologies and industry-standard practices.'
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Learn from experienced professionals with years of industry experience.'
    },
    {
      icon: Award,
      title: 'Industry-Relevant Curriculum',
      description: 'Stay current with the latest technologies and development methodologies.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-lg text-gray-600">
            Comprehensive learning experience designed for your success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}