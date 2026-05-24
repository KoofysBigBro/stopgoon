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
import { content as contentStopPornAtNight } from './posts/stop-porn-at-night'
import { content as contentPornRelapseGuiltShame } from './posts/porn-relapse-guilt-shame'
import { content as contentDoomscrollingAnxietyCure } from './posts/doomscrolling-anxiety-cure'
import { content as contentDigitalDopamineDetox } from './posts/digital-dopamine-detox'
import { content as contentPornWithdrawalSymptoms } from './posts/porn-withdrawal-symptoms'
import { content as contentQuitPornForever } from './posts/quit-porn-forever'
import { content as contentSocialMediaDetoxBenefits } from './posts/social-media-detox-benefits'
import { content as contentHowToStopMasturbating } from './posts/how-to-stop-masturbating'
import { content as contentPornBrainFogRecovery } from './posts/porn-brain-fog-recovery'
import { content as contentNighttimeUrgeSurvival } from './posts/nighttime-urge-survival'
import { content as contentNofapBenefitsByDay } from './posts/nofap-benefits-by-day'
import { content as contentBreakPhoneAddiction } from './posts/break-phone-addiction'
import { content as contentPornTherapyAlternatives } from './posts/porn-therapy-alternatives'
import { content as contentStopScrollingTiktok } from './posts/stop-scrolling-tiktok'
import { content as contentRelapseRecoveryTips } from './posts/relapse-recovery-tips'
import { content as contentDopamineFastingBeginners } from './posts/dopamine-fasting-beginners'
import { content as contentRebuildAfterRelapse } from './posts/rebuild-after-relapse'
import { content as contentPornEffectsOnBrain } from './posts/porn-effects-on-brain'
import { content as contentStopThinkingAboutPorn } from './posts/stop-thinking-about-porn'
import { content as contentMorningRoutineDiscipline } from './posts/morning-routine-discipline'
import { content as contentPiedRecoveryTimeline } from './posts/pied-recovery-timeline'
import { content as contentDopamineDetoxMythVsScience } from './posts/dopamine-detox-myth-vs-science'
import { content as contentHowToStopFappingAtNight } from './posts/how-to-stop-fapping-at-night'
import { content as contentDopamineDetoxSocialMedia } from './posts/dopamine-detox-social-media'
import { content as contentNofapBenefits30Days } from './posts/nofap-benefits-30-days'

// New SEO Article Imports
import { content as contentBestFreeNofapTrackerApp2025 } from './posts/best-free-nofap-tracker-app-2025'
import { content as contentHowToStopCompulsiveHabitsPracticalGuide } from './posts/how-to-stop-compulsive-habits-practical-guide'
import { content as contentWhatIsUrgeSurfingHowDoesItWork } from './posts/what-is-urge-surfing-how-does-it-work'
import { content as contentPornAddictionRecoveryWhatActuallyWorks } from './posts/porn-addiction-recovery-what-actually-works'
import { content as contentWhyNofapStreaksFailWhatToDoInstead } from './posts/why-nofap-streaks-fail-what-to-do-instead'

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
    slug: 'best-free-nofap-tracker-app-2025',
    title: '🏆 The Best Free NoFap Tracker App in 2025: Ditch the Shame, Keep the Progress',
    excerpt: 'Looking for the best free nofap tracker app in 2025? We compare options like StopGoon, Brainbuddy, and Iron Will to help you find the perfect private recovery tool.',
    date: 'May 24, 2026',
    category: 'Recovery Guides',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['nofap', 'app', 'recovery', 'habits'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    content: contentBestFreeNofapTrackerApp2025
  },
  {
    slug: 'how-to-stop-compulsive-habits-practical-guide',
    title: '🧠 How to Stop Compulsive Habits: A Practical, Science-Backed Guide',
    excerpt: 'Struggling with bad habits? Learn how to stop compulsive habits with this science-backed, compassionate, and practical guide to habit replacement.',
    date: 'May 23, 2026',
    category: 'Practical Habits',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['habits', 'science', 'psychology', 'recovery'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    content: contentHowToStopCompulsiveHabitsPracticalGuide
  },
  {
    slug: 'what-is-urge-surfing-how-does-it-work',
    title: '🌊 What Is Urge Surfing and How Does It Work? A Complete Guide',
    excerpt: 'Discover urge surfing, a clinically-proven mindfulness technique to ride out cravings without giving in. Learn how to apply it during high-intensity moments.',
    date: 'May 22, 2026',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['mindfulness', 'urges', 'recovery', 'coping'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    content: contentWhatIsUrgeSurfingHowDoesItWork
  },
  {
    slug: 'porn-addiction-recovery-what-actually-works',
    title: '🏥 Porn Addiction Recovery: What Actually Works (According to Science)',
    excerpt: 'An evidence-based, compassionate guide to porn addiction recovery. Learn what actually works, from dopamine rewiring to identity shifts.',
    date: 'May 21, 2026',
    category: 'Science & Health',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'recovery', 'health', 'science'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    content: contentPornAddictionRecoveryWhatActuallyWorks
  },
  {
    slug: 'why-nofap-streaks-fail-what-to-do-instead',
    title: '🚫 Why NoFap Streaks Fail (and What to Do Instead)',
    excerpt: 'Why do traditional nofap streaks fail so often? Discover the psychology of the shame-streak cycle and why Days of Growth are scientifically superior.',
    date: 'May 20, 2026',
    category: 'Mindset',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['nofap', 'streak', 'psychology', 'mindset'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    content: contentWhyNofapStreaksFailWhatToDoInstead
  },
  {
    slug: 'pied-recovery-timeline',
    title: '🏥 Porn-Induced Erectile Dysfunction (PIED) Recovery Timeline',
    excerpt: 'Understand the neuroscience behind PIED, how high-stimulus pornography desensitizes natural responses, and the step-by-step physical recovery timeline.',
    date: 'May 24, 2026',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'recovery', 'health', 'science'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    content: contentPiedRecoveryTimeline
  },
  {
    slug: 'dopamine-detox-myth-vs-science',
    title: '🧪 Is Dopamine Detox a Myth? The Actual Science Explained',
    excerpt: 'Explore the scientific reality of dopamine receptors, why you can\'t actually \'detox\' a neurotransmitter, and the behavioral adjustments that actually work.',
    date: 'May 20, 2026',
    category: 'Science & Health',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['dopamine', 'detox', 'science', 'focus'],
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
    content: contentDopamineDetoxMythVsScience
  },
  {
    slug: 'how-to-stop-fapping-at-night',
    title: '🌙 How to Stop Fapping at Night: 5 Science-Backed Strategies',
    excerpt: 'Nighttime triggers are driven by an exhausted prefrontal cortex. Discover how to build a friction-based evening routine to stop midnight urges.',
    date: 'May 18, 2026',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['habits', 'nighttime', 'urges', 'recovery'],
    image: 'https://images.unsplash.com/photo-1511295726362-88a7675d1e39?w=800&q=80',
    content: contentHowToStopFappingAtNight
  },
  {
    slug: 'dopamine-detox-social-media',
    title: '📱 How to Dopamine Detox from Social Media in 48 Hours',
    excerpt: 'A weekend step-by-step roadmap to reset your attention span, quiet your brain\'s threat-detection loop, and break the social scroll addiction.',
    date: 'May 15, 2026',
    category: 'Practical Habits',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['social media', 'dopamine', 'detox', 'screentime'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    content: contentDopamineDetoxSocialMedia
  },
  {
    slug: 'nofap-benefits-30-days',
    title: '📈 NoFap Benefits: What Actually Happens in the First 30 Days',
    excerpt: 'A realistic, science-first breakdown of the physical and psychological changes you will experience during the first 30 days of porn abstinence.',
    date: 'May 10, 2026',
    category: 'Recovery Guides',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['nofap', 'benefits', 'timeline', 'recovery'],
    image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80',
    content: contentNofapBenefits30Days
  },
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
    date: 'May 12, 2026',
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
    date: 'April 22, 2026',
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
    date: 'April 10, 2026',
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
    date: 'March 18, 2026',
    category: 'Science & Health',
    readingTime: '9 min read',
    author: 'StopGoon Team',
    tags: ['social media', 'brain', 'attention', 'neuroscience'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    content: contentSocialMediaBrain
  },
  {
    slug: 'stop-porn-at-night',
    title: '🌙 How to Stop Watching Porn at Night: The Complete Guide',
    excerpt: 'Nighttime is the highest-risk window for relapse. Learn how to build defenses that protect you when your willpower is lowest.',
    date: 'March 5, 2026',
    category: 'Recovery Guides',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'night', 'relapse', 'prevention'],
    image: 'https://images.unsplash.com/photo-1511295726362-88a7675d1e39?w=800&q=80',
    content: contentStopPornAtNight
  },
  {
    slug: 'porn-relapse-guilt-shame',
    title: '💔 Porn Relapse Guilt and Shame: How to Break the Cycle',
    excerpt: 'Shame keeps you stuck in the relapse cycle. Learn how to process guilt without spiraling and get back on track faster.',
    date: 'February 20, 2026',
    category: 'Mindset',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['shame', 'guilt', 'relapse', 'psychology'],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80',
    content: contentPornRelapseGuiltShame
  },
  {
    slug: 'doomscrolling-anxiety-cure',
    title: '🧠 Doomscrolling Anxiety: The Cure That Actually Works',
    excerpt: 'Doomscrolling triggers your brain threat detection system. Here is how to break the loop and reduce anxiety naturally.',
    date: 'February 10, 2026',
    category: 'Science & Health',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['doomscrolling', 'anxiety', 'brain', 'digital'],
    image: 'https://images.unsplash.com/photo-1474418397713-6b21ed8a3062?w=800&q=80',
    content: contentDoomscrollingAnxietyCure
  },
  {
    slug: 'digital-dopamine-detox',
    title: '⚡ Digital Dopamine Detox: The Complete Beginner Guide',
    excerpt: 'Reset your brain reward system with a smart dopamine detox. Replace high-stimulus digital habits with meaningful alternatives.',
    date: 'January 28, 2026',
    category: 'Practical Habits',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['dopamine', 'detox', 'digital', 'habits'],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    content: contentDigitalDopamineDetox
  },
  {
    slug: 'porn-withdrawal-symptoms',
    title: '🏥 Porn Withdrawal Symptoms: What to Expect and How to Cope',
    excerpt: 'Withdrawal is a sign your brain is healing. Learn the symptoms timeline and proven strategies to manage each one.',
    date: 'January 20, 2026',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['withdrawal', 'porn', 'symptoms', 'recovery'],
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&q=80',
    content: contentPornWithdrawalSymptoms
  },
  {
    slug: 'quit-porn-forever',
    title: '🎯 How to Quit Porn Forever: The Identity-Based Approach',
    excerpt: 'Stop trying to quit porn and start becoming someone who doesn\'t watch it. The identity shift makes permanent change possible.',
    date: 'December 30, 2025',
    category: 'Mindset',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'quit', 'identity', 'permanent'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    content: contentQuitPornForever
  },
  {
    slug: 'social-media-detox-benefits',
    title: '🌿 Social Media Detox: 10 Benefits You Will Notice in 7 Days',
    excerpt: 'A week without social media can lower cortisol by 35% and improve sleep. Here is what happens when you step away.',
    date: 'December 18, 2025',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['social media', 'detox', 'benefits', 'mental health'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    content: contentSocialMediaDetoxBenefits
  },
  {
    slug: 'how-to-stop-masturbating',
    title: '🛑 How to Stop Masturbating: Replace, Don\'t Suppress',
    excerpt: 'Willpower alone won\'t work. Learn the replacement-based approach that addresses the root cause of compulsive behavior.',
    date: 'December 8, 2025',
    category: 'Practical Habits',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['masturbation', 'habits', 'replacement', 'discipline'],
    image: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&q=80',
    content: contentHowToStopMasturbating
  },
  {
    slug: 'porn-brain-fog-recovery',
    title: '🧠 Porn Brain Fog Recovery: Timeline and Healing Strategies',
    excerpt: 'Brain fog during recovery is caused by dopamine receptor downregulation. Here is how long it lasts and how to speed it up.',
    date: 'November 28, 2025',
    category: 'Science & Health',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['brain fog', 'porn', 'recovery', 'focus'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    content: contentPornBrainFogRecovery
  },
  {
    slug: 'nighttime-urge-survival',
    title: '🌙 Nighttime Urge Survival Guide: Defend Your Recovery After Dark',
    excerpt: 'The 10 PM danger zone is real. Build a nighttime protocol that intercepts urges before they control you.',
    date: 'November 18, 2025',
    category: 'Recovery Guides',
    readingTime: '5 min read',
    author: 'StopGoon Team',
    tags: ['night', 'urges', 'survival', 'routine'],
    image: 'https://images.unsplash.com/photo-1511295726362-88a7675d1e39?w=800&q=80',
    content: contentNighttimeUrgeSurvival
  },
  {
    slug: 'nofap-benefits-by-day',
    title: '📈 NoFap Benefits by Day: What to Expect at Each Stage',
    excerpt: 'A complete timeline of NoFap benefits from day 1 to day 90. Know what to expect and when to expect it.',
    date: 'November 10, 2025',
    category: 'Recovery Guides',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['nofap', 'benefits', 'timeline', 'recovery'],
    image: 'https://images.unsplash.com/photo-1470468969717-61d5d54fd036?w=800&q=80',
    content: contentNofapBenefitsByDay
  },
  {
    slug: 'break-phone-addiction',
    title: '📱 How to Break Phone Addiction: A Practical 5-Step Plan',
    excerpt: 'Your phone is engineered by attention economists. Here is how to take back control without going off the grid.',
    date: 'October 28, 2025',
    category: 'Practical Habits',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['phone', 'addiction', 'screentime', 'digital'],
    image: 'https://images.unsplash.com/photo-1597517697688-7e6a1dd5e8f0?w=800&q=80',
    content: contentBreakPhoneAddiction
  },
  {
    slug: 'porn-therapy-alternatives',
    title: '💊 Porn Addiction Therapy Alternatives: Help When You Can\'t Afford a Therapist',
    excerpt: 'Not everyone has access to a CSAT. Here are evidence-based alternatives including AI coaching and peer support.',
    date: 'October 15, 2025',
    category: 'Recovery Guides',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['therapy', 'alternatives', 'coaching', 'support'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    content: contentPornTherapyAlternatives
  },
  {
    slug: 'stop-scrolling-tiktok',
    title: '📱 How to Stop Scrolling TikTok: Break the Short-Form Loop',
    excerpt: 'TikTok uses variable reward schedules like slot machines. Here is how to break free from short-form content addiction.',
    date: 'October 5, 2025',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['tiktok', 'scrolling', 'addiction', 'attention'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    content: contentStopScrollingTiktok
  },
  {
    slug: 'relapse-recovery-tips',
    title: '🔄 Relapse Recovery Tips: What to Do in the First 24 Hours',
    excerpt: 'A relapse is not a failure — it\'s data. Follow this proven protocol to bounce back stronger than before.',
    date: 'September 22, 2025',
    category: 'Mindset',
    readingTime: '5 min read',
    author: 'StopGoon Team',
    tags: ['relapse', 'recovery', 'tips', 'mindset'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    content: contentRelapseRecoveryTips
  },
  {
    slug: 'dopamine-fasting-beginners',
    title: '⚡ Dopamine Fasting for Beginners: The 24-Hour Reset Guide',
    excerpt: 'A complete guide to your first dopamine fast. Reset your reward system and rediscover the pleasure of simple activities.',
    date: 'September 10, 2025',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['dopamine', 'fasting', 'reset', 'beginners'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    content: contentDopamineFastingBeginners
  },
  {
    slug: 'rebuild-after-relapse',
    title: '🏗️ How to Rebuild After a Relapse: Stronger Than Before',
    excerpt: 'You don\'t start from zero after a relapse. Your brain rewiring doesn\'t disappear overnight. Here is how to rebuild smarter.',
    date: 'August 28, 2025',
    category: 'Mindset',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['rebuild', 'relapse', 'recovery', 'progress'],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80',
    content: contentRebuildAfterRelapse
  },
  {
    slug: 'porn-effects-on-brain',
    title: '🧠 Porn Addiction Effects on the Brain: The Neuroscience Explained',
    excerpt: 'Porn changes your dopamine receptors, prefrontal cortex, and reward pathway. Here is the science of what happens — and how to heal.',
    date: 'August 15, 2025',
    category: 'Science & Health',
    readingTime: '9 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'brain', 'neuroscience', 'addiction'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    content: contentPornEffectsOnBrain
  },
  {
    slug: 'stop-thinking-about-porn',
    title: '🧠 How to Stop Thinking About Porn: The Redirection Method',
    excerpt: 'Suppressing thoughts makes them stronger. Learn the science-backed redirection technique that weakens intrusive thoughts.',
    date: 'August 5, 2025',
    category: 'Mindset',
    readingTime: '5 min read',
    author: 'StopGoon Team',
    tags: ['thoughts', 'intrusive', 'redirect', 'psychology'],
    image: 'https://images.unsplash.com/photo-1499710631859-2f0ab7d7e1ef?w=800&q=80',
    content: contentStopThinkingAboutPorn
  },
  {
    slug: 'morning-routine-discipline',
    title: '☀️ The Morning Routine for Unbreakable Self Discipline',
    excerpt: 'Win the morning, win the day. A science-backed 20-minute morning routine that primes your brain for discipline.',
    date: 'July 25, 2025',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['morning', 'routine', 'discipline', 'habits'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    content: contentMorningRoutineDiscipline
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
