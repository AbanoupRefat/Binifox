import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/database.types'

// Read from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('\nPlease ensure your .env.local file contains:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.error('\nYou can find these values in your Supabase project settings.')
  process.exit(1)
}

console.log('🔑 Using Supabase URL:', supabaseUrl)
console.log('🔑 Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

async function seedDatabase() {
  console.log('\n🌱 Starting database seeding...\n')

  try {
    // 1. Seed Projects
    console.log('📦 Seeding projects...')
    const projects = [
      {
        image_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80',
        title: 'Binifox Business',
        category: 'Business',
      },
      {
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
        title: 'Marketing Analysis',
        category: 'Design',
      },
      {
        image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
        title: 'Business Idea',
        category: 'Logo',
      },
      {
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
        title: 'Consultation',
        category: 'Agency',
      },
      {
        image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
        title: 'Digital Marketing',
        category: 'Business',
      },
      {
        image_url: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&q=80',
        title: 'Super Experience',
        category: 'Design',
      },
    ]

    const { error: projectsError } = await supabase
      .from('projects')
      .insert(projects)

    if (projectsError) throw projectsError
    console.log(`✅ Inserted ${projects.length} projects\n`)

    // 2. Seed News/Articles
    console.log('📰 Seeding news articles...')
    const news = [
      {
        image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
        title: 'Time is money but its not full demand.',
        author: 'Diboli',
        comments_count: 23,
      },
      {
        image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
        title: 'We Are Trying To Do Best Work.',
        author: 'Diboli',
        comments_count: 23,
      },
      {
        image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
        title: 'Nature is The best place for fresh mind.',
        author: 'Diboli',
        comments_count: 23,
      },
    ]

    const { error: newsError } = await supabase
      .from('news')
      .insert(news)

    if (newsError) throw newsError
    console.log(`✅ Inserted ${news.length} news articles\n`)

    // 3. Seed Services
    console.log('🛠️  Seeding services...')
    const services = [
      { icon_name: 'Monitor', title: 'Logo Design' },
      { icon_name: 'Code', title: 'Web Design' },
      { icon_name: 'Palette', title: 'UX/UI Design' },
      { icon_name: 'Globe', title: 'Seo Marketing' },
      { icon_name: 'Smartphone', title: 'App Development' },
      { icon_name: 'PenTool', title: 'Content Writing' },
      { icon_name: 'Layout', title: 'Modern Design' },
      { icon_name: 'BarChart3', title: 'Resource Use' },
    ]

    const { error: servicesError } = await supabase
      .from('services')
      .insert(services)

    if (servicesError) throw servicesError
    console.log(`✅ Inserted ${services.length} services\n`)

    // 4. Seed Team Members
    console.log('👥 Seeding team members...')
    const teamMembers = [
      {
        name: 'Philimia Darwin',
        role: 'Designer',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        facebook_url: '#',
        twitter_url: '#',
        instagram_url: '#',
        linkedin_url: '#',
      },
      {
        name: 'Hilixa Maria',
        role: 'Designer',
        image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        facebook_url: '#',
        twitter_url: '#',
        instagram_url: '#',
        linkedin_url: '#',
      },
      {
        name: 'Willamson Hilai',
        role: 'Designer',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        facebook_url: '#',
        twitter_url: '#',
        instagram_url: '#',
        linkedin_url: '#',
      },
      {
        name: 'Limonda Pwedie',
        role: 'Designer',
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        facebook_url: '#',
        twitter_url: '#',
        instagram_url: '#',
        linkedin_url: '#',
      },
    ]

    const { error: teamError } = await supabase
      .from('team_members')
      .insert(teamMembers)

    if (teamError) throw teamError
    console.log(`✅ Inserted ${teamMembers.length} team members\n`)

    // 5. Seed FAQs
    console.log('❓ Seeding FAQs...')
    const faqs = [
      {
        question: 'How can we help your business?',
        answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        display_order: 1,
      },
      {
        question: 'What are the advantages of Binifox?',
        answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        display_order: 2,
      },
      {
        question: "Let's find an office near you?",
        answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        display_order: 3,
      },
      {
        question: 'Binifox WordPress theme for business?',
        answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        display_order: 4,
      },
    ]

    const { error: faqsError } = await supabase
      .from('faqs')
      .insert(faqs)

    if (faqsError) throw faqsError
    console.log(`✅ Inserted ${faqs.length} FAQs\n`)

    // 6. Seed Stats
    console.log('📊 Seeding stats...')
    const stats = [
      { icon_name: 'Users', value: 4932, label: 'Expert Members' },
      { icon_name: 'Smile', value: 1401, label: 'Satisfied Clients' },
      { icon_name: 'Award', value: 8184, label: 'Problem Solve' },
      { icon_name: 'Settings', value: 1385, label: 'Award Winner' },
    ]

    const { error: statsError } = await supabase
      .from('stats')
      .insert(stats)

    if (statsError) throw statsError
    console.log(`✅ Inserted ${stats.length} stats\n`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📝 Note: The about_features table was not found in your schema.')
    console.log('If you need it, you can add it to your Supabase database.')
  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
    console.error('\nPossible issues:')
    console.error('1. Invalid Supabase credentials - check your .env.local file')
    console.error('2. Tables do not exist - ensure database schema is created')
    console.error('3. Row Level Security policies blocking inserts - check RLS settings')
    console.error('4. Network connectivity issues')
    process.exit(1)
  }
}

seedDatabase()
