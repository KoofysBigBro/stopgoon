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
}

const POSTS: BlogPost[] = [
  {
    slug: 'dopamine-detox-guide',
    title: 'The Ultimate Dopamine Detox Guide: Rewire Your Brain in 2026',
    excerpt: 'Learn how to reset your dopamine receptors, break compulsive digital habits, and reclaim your attention span without toxic hustle culture.',
    date: 'January 15, 2026',
    category: 'Science & Health',
    readingTime: '8 min read',
    author: 'StopGoon Team',
    tags: ['dopamine', 'detox', 'brain', 'habits'],
    content: `
      <h2>The Science of Dopamine</h2>
      <p>Dopamine is not the "pleasure" molecule—it is the <strong>"motivation" molecule</strong>. When you constantly flood your brain with cheap dopamine from doomscrolling, your baseline drops. This is why you feel unmotivated to do difficult tasks.</p>
      <p>Every time you scroll social media, check notifications, or engage in compulsive habits, your brain releases a small amount of dopamine. Over time, your receptors downregulate—meaning you need more stimulation just to feel normal. This is the neurological basis of addiction.</p>

      <h2>How to Detox Correctly</h2>
      <p>A true detox isn't about locking yourself in a dark room. It's about replacing high-dopamine activities (social media, compulsive habits) with low-dopamine, high-effort activities (reading, walking, deep work).</p>
      <p>Here is a step-by-step approach:</p>
      <ul>
        <li><strong>Identify your triggers.</strong> Use StopGoon's urge tracking to identify the specific times of day your brain craves those cheap dopamine hits.</li>
        <li><strong>Create friction.</strong> Remove apps from your home screen. Use grayscale mode. Put your phone in another room during deep work.</li>
        <li><strong>Replace, don't remove.</strong> For every high-dopamine habit you cut, add a low-dopamine alternative. Reading, meditation, or a walk.</li>
        <li><strong>Start with 24 hours.</strong> A single day of abstinence can begin the resensitization process. Notice how your motivation returns.</li>
      </ul>

      <blockquote>
        "The opposite of addiction is not sobriety. It is connection." — Johann Hari
      </blockquote>

      <h2>Common Mistakes</h2>
      <p>Most people fail at dopamine detox because they treat it as punishment. They remove all pleasurable activities and then wonder why they relapse hard after a few days. A sustainable detox replaces high-intensity dopamine sources with medium-intensity, meaningful ones.</p>

      <h2>Tracking Your Progress</h2>
      <p>Use the Days of Growth metric in StopGoon rather than streak counting. If you were clean for 60 days, relapsed once, and then stayed clean for another 10 days, your growth is 70 days—not 10. This science-backed approach prevents the "What the Hell" effect that destroys traditional streaks.</p>
    `
  },
  {
    slug: 'stop-doomscrolling',
    title: 'How to Stop Doomscrolling Late at Night',
    excerpt: 'A practical, science-backed approach to putting your phone away at night and getting your sleep schedule back on track.',
    date: 'February 2, 2026',
    category: 'Practical Habits',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['doomscrolling', 'sleep', 'habits', 'phone'],
    content: `
      <h2>The Evening Trap</h2>
      <p>When you are tired, your prefrontal cortex (the part of your brain responsible for willpower) is exhausted. This makes 10 PM to 2 AM the highest-risk window for compulsive habits.</p>
      <p>Your brain craves stimulation precisely when it needs rest the most. This is not a character flaw—it is basic neuroscience. Understanding this removes shame and lets you build systems instead.</p>

      <h2>Why Late Night Scrolling is Especially Damaging</h2>
      <p>Blue light from screens suppresses melatonin production, making it harder to fall asleep. But the real damage is psychological: late-night doomscrolling floods your brain with anxiety-inducing content right before bed, leading to poor sleep quality and a stressed nervous system the next day.</p>

      <h2>Actionable Fixes</h2>
      <ul>
        <li><strong>Physical Distance:</strong> Put your phone charger across the room. Buy a dedicated alarm clock.</li>
        <li><strong>The 10-Minute Rule:</strong> Tell yourself you can scroll, but you have to read a physical book for 10 minutes first. Usually, the urge passes.</li>
        <li><strong>Use the SOS Button:</strong> StopGoon's SOS feature is designed specifically to intercept these late-night urges with guided breathing and grounding exercises.</li>
        <li><strong>Set a digital sunset:</strong> Choose a time (e.g., 9 PM) after which you do not consume any short-form content. Read books or listen to podcasts instead.</li>
      </ul>

      <blockquote>
        "Sleep is the single most effective thing we can do to reset our brain and body health each day." — Matthew Walker
      </blockquote>

      <h2>Build a Night Routine</h2>
      <p>The key to stopping doomscrolling is not willpower—it is a compelling alternative. Design a wind-down routine that you actually look forward to:</p>
      <ul>
        <li>Dim the lights at least 30 minutes before bed</li>
        <li>Journal about your day (use StopGoon's journal feature)</li>
        <li>Read fiction (not self-help—give your brain a break)</li>
        <li>Light stretching or breathing exercises</li>
      </ul>
    `
  },
  {
    slug: 'anti-streak-philosophy',
    title: 'Why "Don\'t Break the Streak" is Terrible Advice for Addiction Recovery',
    excerpt: 'The "What the Hell" effect destroys progress. Learn why tracking days of growth is scientifically superior to maintaining perfect streaks.',
    date: 'March 10, 2026',
    category: 'Mindset',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['streak', 'mindset', 'psychology', 'recovery'],
    content: `
      <h2>The "What the Hell" Effect</h2>
      <p>If you have a 60-day streak and you relapse, traditional counters drop back to zero. This induces immense shame. Psychologically, your brain says, "Well, the streak is broken, might as well binge."</p>
      <p>This phenomenon, known as the <strong>"What the Hell" effect</strong>, has been documented extensively in addiction research. It is the single biggest reason why traditional streak counters fail for long-term recovery.</p>

      <h2>Why Streaks Work for Some Things</h2>
      <p>Streaks are effective for positive habit formation—like going to the gym or studying daily. But addiction recovery is fundamentally different. Addiction involves shame cycles, and streak counters amplify those cycles.</p>

      <h2>Days of Growth > Streaks</h2>
      <p>StopGoon measures <strong>Days of Growth</strong>. If you were clean for 60 days, relapsed once, and then stayed clean for another 10 days, your growth is 70 days, not 10. A single lapse does not erase two months of brain rewiring.</p>
      <p>This approach is backed by relapse prevention research. When you track growth instead of streaks:</p>
      <ul>
        <li>Shame decreases, making it easier to get back on track</li>
        <li>You recognize that progress is not linear</li>
        <li>Each lapse becomes a learning opportunity, not a catastrophic failure</li>
        <li>Your long-term motivation stays higher</li>
      </ul>

      <blockquote>
        "Fall seven times, stand up eight." — Japanese Proverb
      </blockquote>

      <h2>How to Implement This Today</h2>
      <p>If you are using a traditional streak counter right now, here is what I recommend:</p>
      <ol>
        <li>Stop looking at your streak number every day</li>
        <li>Start tracking your overall growth percentage</li>
        <li>When you lapse, ask "What can I learn?" instead of "How could I be so weak?"</li>
        <li>Use StopGoon's analytics to see your long-term trend, not your daily binary pass/fail</li>
      </ol>
    `
  },
  {
    slug: 'building-self-discipline',
    title: 'Building Self-Discipline: A Practical Framework That Actually Works',
    excerpt: 'Forget motivation. Discipline is a skill you can train with specific, repeatable exercises. Here is the exact framework.',
    date: 'March 28, 2026',
    category: 'Practical Habits',
    readingTime: '9 min read',
    author: 'StopGoon Team',
    tags: ['discipline', 'habits', 'framework', 'self-improvement'],
    content: `
      <h2>Motivation is a Trap</h2>
      <p>Most people wait to feel motivated before taking action. This is backwards. Motivation follows action, not the other way around. The key to self-discipline is building systems that work regardless of how you feel.</p>

      <h2>The Discipline Stack</h2>
      <p>Think of discipline as a stack of habits that reinforce each other. Here is the framework:</p>

      <h3>Layer 1: Environment Design</h3>
      <p>Your environment shapes your behavior more than your willpower ever will. If your phone is next to your bed, you will scroll. If there are chips on the counter, you will eat them. Design your environment for the person you want to become, not the person you are.</p>
      <ul>
        <li>Remove triggers from your immediate environment</li>
        <li>Put obstacles between you and bad habits</li>
        <li>Make good habits the path of least resistance</li>
      </ul>

      <h3>Layer 2: Identity-Based Habits</h3>
      <p>Instead of saying "I am trying to quit," say "I am not the kind of person who does that." Identity-based habits stick because they align with your self-image. Each time you make the disciplined choice, you reinforce your identity as a disciplined person.</p>

      <h3>Layer 3: The 2-Minute Rule</h3>
      <p>Any new habit should take less than two minutes to start. Want to read more? Read one page. Want to meditate? Breathe once. The first action is the hardest—make it laughably easy.</p>

      <blockquote>
        "We do not rise to the level of our goals. We fall to the level of our systems." — James Clear
      </blockquote>

      <h2>Tracking Your Discipline Growth</h2>
      <p>Use StopGoon's daily check-in to track your discipline consistency. Focus on showing up every day, not being perfect. Over time, these small daily actions compound into extraordinary results.</p>
    `
  },
  {
    slug: 'understanding-relapse-triggers',
    title: 'Understanding Your Relapse Triggers: A Data-Driven Approach',
    excerpt: 'Most relapses are predictable. Learn how to identify your personal trigger patterns and build proactive defenses.',
    date: 'April 15, 2026',
    category: 'Science & Health',
    readingTime: '7 min read',
    author: 'StopGoon Team',
    tags: ['relapse', 'triggers', 'data', 'analytics'],
    content: `
      <h2>Relapse is Not Random</h2>
      <p>One of the most liberating discoveries in addiction science is that relapses are rarely random events. They follow predictable patterns based on triggers, contexts, and internal states.</p>
      <p>When you understand your personal trigger profile, you can build defenses before the urge hits—instead of relying on willpower in the moment.</p>

      <h2>Common Trigger Categories</h2>
      <ul>
        <li><strong>Emotional Triggers:</strong> Stress, boredom, loneliness, anger, or excitement. These are the most common and most powerful.</li>
        <li><strong>Environmental Triggers:</strong> Certain locations, times of day, or devices that you associate with the habit.</li>
        <li><strong>Social Triggers:</strong> Being around certain people, or being alone when you expect social connection.</li>
        <li><strong>Physiological Triggers:</strong> Hunger, fatigue, or physical discomfort that lowers your inhibition.</li>
      </ul>

      <h2>Track to Find Patterns</h2>
      <p>StopGoon's urge logging feature lets you tag each urge with context: time, location, emotional state, and intensity. After a week of logging, you will start seeing clear patterns emerge.</p>
      <p>For example, you might discover that 80% of your urges happen between 10 PM and midnight, or that stress at work triples your relapse risk. This data is power.</p>

      <blockquote>
        "Knowing yourself is the beginning of all wisdom." — Aristotle
      </blockquote>

      <h2>Building Proactive Defenses</h2>
      <p>Once you know your triggers, you can build specific defenses:</p>
      <ul>
        <li>If stress is your trigger: Build a 5-minute breathing routine</li>
        <li>If late night is your trigger: Create a phone-free wind-down ritual</li>
        <li>If boredom is your trigger: Prepare a list of engaging alternatives</li>
      </ul>
      <p>StopGoon's Predictive Warning feature uses your logged data to alert you before high-risk windows, giving you time to deploy your defenses.</p>
    `
  },
  {
    slug: 'porn-recovery-roadmap',
    title: 'The First 30 Days of Porn Recovery: A Complete Roadmap',
    excerpt: 'A day-by-day guide to navigating the first month of recovery, from initial withdrawal to building new neural pathways.',
    date: 'May 5, 2026',
    category: 'Recovery Guides',
    readingTime: '10 min read',
    author: 'StopGoon Team',
    tags: ['porn', 'recovery', 'guide', '30-days'],
    content: `
      <h2>Why the First 30 Days Matter Most</h2>
      <p>The first 30 days of recovery are the hardest—and the most important. Your brain is going through withdrawal, your habits are being disrupted, and your emotional regulation is challenged. But this is also when the most profound changes happen.</p>

      <h2>Week 1: The Detox Phase (Days 1-7)</h2>
      <p>This is the hardest week. Your brain is still expecting its usual dopamine hits. You may experience irritability, insomnia, mood swings, and intense cravings.</p>
      <ul>
        <li><strong>Day 1-2:</strong> Remove all triggers. Install blockers, delete apps, clean your bookmarks.</li>
        <li><strong>Day 3-4:</strong> Expect peak cravings. Have your SOS plan ready. Use StopGoon's breathing exercises.</li>
        <li><strong>Day 5-7:</strong> Cravings start to space out. Notice the small wins—more energy, clearer thinking.</li>
      </ul>

      <h2>Week 2: The Adjustment Phase (Days 8-14)</h2>
      <p>Your brain is beginning to recalibrate. Cravings are less intense but can be triggered by unexpected things.</p>
      <ul>
        <li>Start a daily journaling habit in StopGoon</li>
        <li>Identify your top 3 triggers and build specific defenses</li>
        <li>Increase physical activity—exercise accelerates dopamine receptor recovery</li>
      </ul>

      <h2>Week 3: The Rebuilding Phase (Days 15-21)</h2>
      <p>This is where the real work begins. The initial withdrawal fog lifts, and you need to fill the void with meaningful activities.</p>
      <ul>
        <li>Reconnect with hobbies you abandoned</li>
        <li>Invest in social connections (accountability partners in StopGoon)</li>
        <li>Set small, achievable goals outside of recovery</li>
      </ul>

      <h2>Week 4: The Integration Phase (Days 22-30)</h2>
      <p>By now, you have built momentum. Your brain is forming new pathways. The goal is to lock in these gains.</p>
      <ul>
        <li>Review your month of growth in StopGoon analytics</li>
        <li>Plan for the next 30 days with clear intentions</li>
        <li>Celebrate your progress—you earned it</li>
      </ul>

      <blockquote>
        "The secret of getting ahead is getting started." — Mark Twain
      </blockquote>

      <p>Remember: if you relapse during these 30 days, it does not erase your progress. Log it in StopGoon, learn from it, and continue. Days of Growth measures your total recovery, not your streak.</p>
    `
  },
  {
    slug: 'coaching-vs-willpower',
    title: 'AI Coaching vs. Willpower: Why You Need Both for Lasting Change',
    excerpt: 'Willpower alone is not enough for complex behavior change. Discover how AI coaching fills the gap between knowing and doing.',
    date: 'May 20, 2026',
    category: 'Mindset',
    readingTime: '6 min read',
    author: 'StopGoon Team',
    tags: ['ai', 'coaching', 'willpower', 'change'],
    content: `
      <h2>The Willpower Myth</h2>
      <p>We have been sold a story that lasting change is a matter of willpower. Just try harder. Just be more disciplined. But if willpower alone worked, everyone who wanted to change would have changed by now.</p>
      <p>The reality is that willpower is a finite resource. It depletes throughout the day. And when you are tired, stressed, or triggered, your willpower reserves are at their lowest—exactly when you need them most.</p>

      <h2>Where AI Coaching Comes In</h2>
      <p>AI coaching bridges the gap between intention and action. Here is how:</p>
      <ul>
        <li><strong>24/7 Availability:</strong> Your AI coach is always there, even at 2 AM when willpower is gone.</li>
        <li><strong>Non-Judgmental:</strong> No shame, no disappointment. Just objective guidance.</li>
        <li><strong>Personalized:</strong> Learns your patterns and tailors strategies to your specific triggers.</li>
        <li><strong>Proactive:</strong> Intercepts you before a lapse, not after.</li>
      </ul>

      <h2>The StopGoon AI Coach</h2>
      <p>StopGoon's built-in AI coach combines CBT techniques, motivational interviewing, and your personal data to provide real-time support. It knows your triggers, your progress, and your goals. When you feel an urge coming on, you can open the chat and get immediate, personalized strategies.</p>

      <blockquote>
        "Between stimulus and response there is a space. In that space is our power to choose." — Viktor Frankl
      </blockquote>

      <h2>Building Your Support System</h2>
      <p>AI coaching works best as part of a complete support system. Combine it with:</p>
      <ul>
        <li>Daily check-ins and urge logging</li>
        <li>Accountability partners (real human connection)</li>
        <li>SOS tools for high-risk moments</li>
        <li>Weekly reviews to track patterns</li>
      </ul>
      <p>This combination of human support, AI guidance, and data-driven insights creates a foundation for lasting change that willpower alone cannot provide.</p>
    `
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
