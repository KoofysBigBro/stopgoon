import { content as contentDopamineDetoxGuide } from './posts/dopamine-detox-guide'
import { content as contentStopDoomscrolling } from './posts/stop-doomscrolling'
import { content as contentAntiStreakPhilosophy } from './posts/anti-streak-philosophy'
import { content as contentBuildingSelfDiscipline } from './posts/building-self-discipline'
import { content as contentUnderstandingRelapseTriggers } from './posts/understanding-relapse-triggers'
import { content as contentPornRecoveryRoadmap } from './posts/porn-recovery-roadmap'
import { content as contentCoachingVsWillpower } from './posts/coaching-vs-willpower'
import { content as contentMorningRoutineReset } from './posts/morning-routine-reset'
import { content as contentShameAndRecovery } from './posts/shame-and-recovery'
import { content as contentSocialMediaBrain } from './posts/social-media-brain'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  readingTime: string
  author: string
  tags: string[]
  image: string
  quiz?: { question: string; options: string[]; answer: number }[]
}

const POSTS: BlogPost[] = [
  {
    slug: 'dopamine-detox-guide',
    title: '🧠 The Ultimate Dopamine Detox Guide: Rewire Your Brain',
    excerpt: 'Learn how to reset your dopamine receptors, break compulsive digital habits, and reclaim your attention span without toxic hustle culture.',
    date: 'January 15, 2026',
    category: 'Science & Health',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['dopamine', 'detox', 'brain', 'habits'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    quiz: [
      { question: 'What is dopamine really responsible for?', options: ['Pleasure', 'Motivation', 'Sleep', 'Memory'], answer: 1 },
      { question: 'What should you do instead of just removing bad habits?', options: ['Nothing', 'Replace with low-dopamine activities', 'Sleep more', 'Take pills'], answer: 1 },
    ],
    content: contentDopamineDetoxGuide
  },
  {
    slug: 'stop-doomscrolling',
    title: '🌙 How to Stop Doomscrolling Late at Night',
    excerpt: 'A practical, science-backed approach to putting your phone away at night and getting your sleep schedule back on track.',
    date: 'February 2, 2026',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['doomscrolling', 'sleep', 'habits', 'phone'],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    quiz: [
      { question: 'What part of your brain is exhausted at night, making willpower harder?', options: ['Cerebellum', 'Prefrontal cortex', 'Amygdala', 'Brain stem'], answer: 1 },
      { question: 'What is the 10-Minute Rule?', options: ['Scroll for 10 more minutes', 'Read a book for 10 minutes before scrolling', 'Sleep for 10 minutes', 'Exercise for 10 minutes'], answer: 1 },
    ],
    content: contentStopDoomscrolling
  },
  {
    slug: 'anti-streak-philosophy',
    title: '🚫 Why "Don\'t Break the Streak" is Terrible Advice',
    excerpt: 'The "What the Hell" effect destroys progress. Learn why tracking Days of Growth is scientifically superior to maintaining perfect streaks.',
    date: 'March 10, 2026',
    category: 'Mindset',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['streak', 'mindset', 'psychology', 'recovery'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    quiz: [
      { question: 'What is the "What the Hell" effect?', options: ['A hangover', 'Binging after a lapse because the streak is broken', 'A sleep disorder', 'A type of meditation'], answer: 1 },
      { question: 'What does StopGoon measure instead of streaks?', options: ['Hours online', 'Days of Growth', 'Calories burned', 'Pages read'], answer: 1 },
    ],
    content: contentAntiStreakPhilosophy
  },
  {
    slug: 'building-self-discipline',
    title: '🔥 Building Self-Discipline: A Framework That Actually Works',
    excerpt: 'Forget motivation. Discipline is a skill you can train with specific, repeatable exercises. Here is the exact framework.',
    date: 'March 28, 2026',
    category: 'Practical Habits',
    readingTime: '9 min read',
    author: 'StopGoon Team',
    tags: ['discipline', 'habits', 'framework', 'self-improvement'],
    image: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&q=80',
    quiz: [
      { question: 'What comes first — motivation or action?', options: ['Motivation', 'Action', 'They come together', 'Neither'], answer: 1 },
      { question: 'How long should a new habit take to start?', options: ['30 minutes', 'Under 2 minutes', '1 hour', 'As long as needed'], answer: 1 },
    ],
    content: contentBuildingSelfDiscipline
  },
  {
    slug: 'understanding-relapse-triggers',
    title: '📊 Understanding Your Relapse Triggers: A Data-Driven Approach',
    excerpt: 'Most relapses are predictable. Learn how to identify your personal trigger patterns and build proactive defenses.',
    date: 'April 15, 2026',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['relapse', 'triggers', 'data', 'analytics'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    quiz: [
      { question: 'Are relapses random events?', options: ['Yes, always', 'No, they follow patterns', 'Sometimes', 'Only when tired'], answer: 1 },
      { question: 'Which trigger category is most common?', options: ['Environmental', 'Emotional', 'Social', 'Physiological'], answer: 1 },
    ],
    content: contentUnderstandingRelapseTriggers
  },
  {
    slug: 'porn-recovery-roadmap',
    title: '🗺️ The First 30 Days of Porn Recovery: A Complete Roadmap',
    excerpt: 'A day-by-day guide to navigating the first month of recovery, from initial withdrawal to building new neural pathways.',
    date: 'May 5, 2026',
    category: 'Recovery Guides',
    readingTime: '10 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'recovery', 'guide', '30-days'],
    image: 'https://images.unsplash.com/photo-1470468969717-61d5d54fd036?w=800&q=80',
    quiz: [
      { question: 'Which week of recovery has the peak cravings?', options: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], answer: 0 },
      { question: 'What accelerates dopamine receptor recovery?', options: ['More sleep', 'Exercise', 'Meditation', 'All of the above'], answer: 3 },
    ],
    content: contentPornRecoveryRoadmap
  },
  {
    slug: 'coaching-vs-willpower',
    title: '🤖 AI Coaching vs. Willpower: Why You Need Both',
    excerpt: 'Willpower alone is not enough for complex behavior change. Discover how AI coaching fills the gap between knowing and doing.',
    date: 'May 20, 2026',
    category: 'Mindset',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['ai', 'coaching', 'willpower', 'change'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    quiz: [
      { question: 'Why does willpower alone often fail?', options: ['It is a finite resource that depletes', 'It doesn\'t exist', 'It\'s too strong', 'It only works for men'], answer: 0 },
      { question: 'What makes AI coaching different from a human coach?', options: ['It judges you', 'It\'s available 24/7 and non-judgmental', 'It costs more', 'It doesn\'t work'], answer: 1 },
    ],
    content: contentCoachingVsWillpower
  },
  {
    slug: 'morning-routine-reset',
    title: '☀️ The 10-Minute Morning Routine That Resets Your Brain',
    excerpt: 'Start your day with intention instead of reactivity. This 10-minute routine sets the tone for a disciplined day.',
    date: 'June 8, 2026',
    category: 'Practical Habits',
    readingTime: '5 min read',
    author: 'StopGoon Team',
    tags: ['morning', 'routine', 'habits', 'brain'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    content: contentMorningRoutineReset
  },
  {
    slug: 'shame-and-recovery',
    title: '💔 Why Shame is the Enemy of Recovery (And What to Do Instead)',
    excerpt: 'Shame keeps you stuck in the cycle. Learn how to break free from shame and build self-compassion.',
    date: 'June 25, 2026',
    category: 'Mindset',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['shame', 'self-compassion', 'psychology', 'recovery'],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80',
    content: contentShameAndRecovery
  },
  {
    slug: 'social-media-brain',
    title: '📱 How Social Media Rewires Your Brain (And How to Take It Back)',
    excerpt: 'The platforms are designed to be addictive. Here is the neuroscience of why and how to reclaim your attention.',
    date: 'July 12, 2026',
    category: 'Science & Health',
    readingTime: '9 min read',
    author: 'StopGoon Team',
    tags: ['social media', 'brain', 'attention', 'neuroscience'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    content: contentSocialMediaBrain
  }
]

export function getBlogPosts(): BlogPost[] {
  return POSTS
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find(post => post.slug === slug)
}

export function getCategories(): string[] {
  return [...new Set(POSTS.map(post => post.category))]
}

export function getRelatedPosts(slug: string, count: number = 2): BlogPost[] {
  const current = getBlogPostBySlug(slug)
  if (!current) return []

  return POSTS
    .filter(post => post.slug !== slug)
    .filter(post =>
      post.category === current.category ||
      post.tags.some(tag => current.tags.includes(tag))
    )
    .slice(0, count)
}
