/* ============================================================
   Mock Data – SkillBridge
   All static data used across the app lives here for easy
   maintenance and future API migration.
   ============================================================ */

// ── Navigation links ──────────────────────────────────────── */
export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

// ── Featured skills displayed on the Home page ────────────── */
export const featuredSkills = [
  {
    id: 1,
    title: 'UI/UX Design',
    description: 'Craft stunning user interfaces and seamless user experiences that captivate and convert.',
    icon: '🎨',
    color: '#a855f7',
    learners: 2340,
  },
  {
    id: 2,
    title: 'Web Development',
    description: 'Build modern, responsive websites and web applications with cutting-edge technologies.',
    icon: '💻',
    color: '#ec4899',
    learners: 3120,
  },
  {
    id: 3,
    title: 'Data Science',
    description: 'Transform raw data into actionable insights using machine learning and statistical analysis.',
    icon: '📊',
    color: '#8b5cf6',
    learners: 1890,
  },
  {
    id: 4,
    title: 'Digital Marketing',
    description: 'Master SEO, social media, and paid advertising to grow brands in the digital landscape.',
    icon: '📱',
    color: '#f472b6',
    learners: 2780,
  },
  {
    id: 5,
    title: 'Video Editing',
    description: 'Create cinematic videos and engaging content with professional editing techniques.',
    icon: '🎬',
    color: '#c084fc',
    learners: 1560,
  },
  {
    id: 6,
    title: 'AI & Machine Learning',
    description: 'Explore neural networks, deep learning, and intelligent automation for tomorrow\'s solutions.',
    icon: '🤖',
    color: '#d946ef',
    learners: 2950,
  },
];

// ── How it works steps ────────────────────────────────────── */
export const howItWorks = [
  {
    step: 1,
    title: 'Create Your Profile',
    description: 'Sign up in seconds and showcase the skills you have and the skills you want to learn.',
    icon: '👤',
  },
  {
    step: 2,
    title: 'Find Your Match',
    description: 'Our smart algorithm pairs you with the perfect skill exchange partner based on mutual interests.',
    icon: '🔍',
  },
  {
    step: 3,
    title: 'Exchange & Grow',
    description: 'Connect via live sessions, collaborate on projects, and level up your skill set together.',
    icon: '🚀',
  },
  {
    step: 4,
    title: 'Earn & Showcase',
    description: 'Build your reputation, earn badges, and showcase your portfolio to potential clients.',
    icon: '🏆',
  },
];

// ── Testimonials ──────────────────────────────────────────── */
export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'UX Designer at Google',
    avatar: 'SC',
    content: 'SkillBridge transformed how I learn. I exchanged my design skills for coding knowledge and landed my dream job within 3 months!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full-Stack Developer',
    avatar: 'MJ',
    content: 'The real-time skill matching is incredible. I found the perfect partner to learn machine learning while teaching React development.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Data Analyst at Meta',
    avatar: 'AP',
    content: 'What sets SkillBridge apart is the community. Everyone is genuinely passionate about learning and teaching. It\'s a game-changer.',
    rating: 5,
  },
];

// ── Platform Statistics ───────────────────────────────────── */
export const stats = [
  { label: 'Active Learners', value: '50K+', icon: '👥' },
  { label: 'Skills Available', value: '200+', icon: '📚' },
  { label: 'Exchanges Done', value: '120K+', icon: '🔄' },
  { label: 'Countries', value: '90+', icon: '🌍' },
];

// ── About page – core values ─────────────────────────────── */
export const coreValues = [
  {
    title: 'Community First',
    description: 'We believe learning is best when it is shared. Our platform fosters a global community of curious minds.',
    icon: '🤝',
  },
  {
    title: 'Accessible Education',
    description: 'Knowledge should not have a price tag. SkillBridge makes premium skill exchange free for everyone.',
    icon: '🌐',
  },
  {
    title: 'Innovation Driven',
    description: 'We leverage AI matching, real-time collaboration, and gamification to redefine peer-to-peer learning.',
    icon: '💡',
  },
  {
    title: 'Quality Assured',
    description: 'Every exchange is rated and reviewed, ensuring the highest quality learning experiences.',
    icon: '✅',
  },
];

// ── About page – team members ─────────────────────────────── */
export const teamMembers = [
  { name: 'Shivanghi Sharma', role: 'Backend Developer', avatar: 'SS' },
  { name: 'Priyanshu Negi', role: 'Frontend Developer', avatar: 'PN' },
  { name: 'Rahil Baksh', role: 'AI  ', avatar: 'RB' },
  { name: 'Shubham Kathane', role: 'Database', avatar: 'SK' },
];

// ── Contact page – info items ─────────────────────────────── */
export const contactInfo = [
  {
    title: 'Email Us',
    detail: 'hello@skillbridge.io',
    icon: '📧',
    description: 'Drop us a line and we\'ll get back within 24 hours.',
  },
  {
    title: 'Call Us',
    detail: '+1 (555) 123-4567',
    icon: '📞',
    description: 'Available Mon–Fri, 9 AM – 6 PM EST.',
  },
  {
    title: 'Visit Us',
    detail: '123 Innovation Drive, San Francisco, CA',
    icon: '📍',
    description: 'Come say hi at our headquarters.',
  },
];

// ── Skill interest options (for footer registration form) ─── */
export const skillInterests = [
  'UI/UX Design',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Digital Marketing',
  'Video Editing',
  'Graphic Design',
  'Content Writing',
  'Cybersecurity',
  'Cloud Computing',
  'Blockchain',
];

// ── Footer links ──────────────────────────────────────────── */
export const footerLinks = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Integrations', href: '#' },
    { name: 'API', href: '#' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'FAQs', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};