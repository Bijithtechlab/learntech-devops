export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'LearnTechLab',
    url: 'https://www.learntechlab.com',
    logo: 'https://www.learntechlab.com/images/institutions-og.jpg',
    description: 'AI-Powered Software Development training platform offering courses in Cloud, GenAI, Vibe Coding, and DevOps.',
    email: 'info@learntechlab.com',
    sameAs: [],
    foundingDate: '2024',
    areaServed: 'Worldwide',
    teaches: ['Artificial Intelligence', 'Cloud Computing', 'Software Development', 'DevOps', 'Project Management'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LearnTechLab',
    url: 'https://www.learntechlab.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.learntechlab.com/courses/',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
