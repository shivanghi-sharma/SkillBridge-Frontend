/* ============================================================
   Mock Data – SkillBridge
   All static data used across the app lives here for easy
   maintenance and future API migration.
   ============================================================ */

// ── Navigation links ──────────────────────────────────────── */
export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
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

// ── Sellers for Explore page ──────────────────────────────── */
export const sellers = [
  { id: 1, name: 'Arjun Sharma', avatar: 'AS', skill: 'React + Node.js', rating: 4.9, sessions: 128, price: 299, tags: ['Frontend', 'Backend', 'JavaScript'], available: true, bio: '3rd year CS @ IIT Delhi. MERN specialist.' },
  { id: 2, name: 'Priya Nair', avatar: 'PN', skill: 'UI/UX Design', rating: 4.8, sessions: 94, price: 399, tags: ['Figma', 'Wireframes', 'Prototyping'], available: true, bio: 'Product designer with 2yr internship exp.' },
  { id: 3, name: 'Rohan Mehta', avatar: 'RM', skill: 'Python & ML', rating: 4.7, sessions: 67, price: 499, tags: ['Python', 'ML', 'Data Science'], available: false, bio: 'Final year at BITS Pilani, ML researcher.' },
  { id: 4, name: 'Sneha Kapoor', avatar: 'SK', skill: 'Resume & LinkedIn', rating: 5.0, sessions: 211, price: 199, tags: ['Resume', 'LinkedIn', 'Career'], available: true, bio: 'Placed at Google. Helped 200+ students.' },
  { id: 5, name: 'Vikram Das', avatar: 'VD', skill: 'DSA Mentoring', rating: 4.9, sessions: 156, price: 349, tags: ['DSA', 'LeetCode', 'Interviews'], available: true, bio: 'SDE-2 at Amazon. 500+ LeetCode problems.' },
  { id: 6, name: 'Meera Iyer', avatar: 'MI', skill: 'Logo & Branding', rating: 4.6, sessions: 43, price: 249, tags: ['Logo', 'Branding', 'Illustrator'], available: true, bio: 'Freelance designer, worked with 30+ brands.' },
];

// ── Time slots for booking ────────────────────────────────── */
export const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
  '7:00 PM', '8:00 PM',
];

// ── Chat mock messages ────────────────────────────────────── */
export const chatMessages = [
  { id: 1, sender: 'seller', text: 'Hi! I saw your booking for React debugging. What\'s the issue exactly?', time: '7:02 PM' },
  { id: 2, sender: 'buyer', text: 'Hey! My useEffect hook is running infinitely. I think it\'s a dependency array issue.', time: '7:03 PM' },
  { id: 3, sender: 'seller', text: 'Ah classic! Share your code snippet and I\'ll help you fix it before our session.', time: '7:04 PM' },
];

// ── Notifications ─────────────────────────────────────────── */
export const notifications = [
  { id: 1, type: 'booking', message: 'Arjun Sharma confirmed your session at 8 PM today!', time: '2h ago', read: false },
  { id: 2, type: 'payment', message: '₹299 held in escrow for your React session.', time: '2h ago', read: false },
  { id: 3, type: 'review', message: 'Priya gave you a 5★ review! Your rank improved.', time: '1d ago', read: true },
  { id: 4, type: 'chat', message: 'New message from Rohan Mehta about your Python session.', time: '3d ago', read: true },
];

// ── Dashboard stats ───────────────────────────────────────── */
export const buyerStats = [
  { label: 'Sessions Booked', value: 7, icon: '📅' },
  { label: 'Skills Learned', value: 4, icon: '🎯' },
  { label: 'Total Spent', value: '₹2,100', icon: '💰' },
  { label: 'Avg Rating Given', value: '4.8★', icon: '⭐' },
];

export const sellerStats = [
  { label: 'Sessions Done', value: 23, icon: '✅' },
  { label: 'Total Earned', value: '₹6,890', icon: '💰' },
  { label: 'Avg Rating', value: '4.9★', icon: '⭐' },
  { label: 'Repeat Clients', value: 8, icon: '🔄' },
];

// ── My sessions ───────────────────────────────────────────── */
export const mySessions = [
  { id: 1, seller: 'Arjun Sharma', skill: 'React Debugging', date: 'Today, 8 PM', status: 'upcoming', price: 299, rated: false },
  { id: 2, seller: 'Priya Nair', skill: 'UI/UX Wireframes', date: 'Yesterday, 6 PM', status: 'completed', price: 399, rated: true, rating: 5 },
  { id: 3, seller: 'Sneha Kapoor', skill: 'Resume Review', date: '3 days ago', status: 'completed', price: 199, rated: false },
];