import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import { staggerContainer } from '../utils/helpers';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = (search = '') => {
    setLoading(true);
    let url = '/api/skills';
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSkills(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkills(searchTerm);
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'design': return '#a855f7';
      case 'web development': return '#ec4899';
      default: return '#8b5cf6';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'design': return '🎨';
      case 'web development': return '💻';
      default: return '🚀';
    }
  };

  return (
    <PageTransition>
      <section className="relative section-padding pt-32 min-h-screen">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <SectionTitle title="Explore Skills" subtitle="Discover new opportunities" />

          {/* Search Bar */}
          <div className="mb-10 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for skills, e.g. React..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-slate-900/50 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 input-glow"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-2 my-auto h-8 px-4 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium hover:bg-purple-500/30 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {skills.length > 0 ? (
                skills.map((skill, i) => (
                  <GlassCard key={skill._id} delay={i * 0.1}>
                    {/* Icon badge */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
                      style={{ background: `${getCategoryColor(skill.category)}18` }}
                    >
                      {getCategoryIcon(skill.category)}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-[var(--font-heading)]">
                      {skill.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {skill.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skill.tags?.slice(0,3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 text-purple-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-sm font-bold text-white">
                        ${skill.price}<span className="text-xs text-gray-500 font-normal">/session</span>
                      </span>
                      <motion.button
                        onClick={() => navigate(`/skills/${skill._id}`)}
                        whileHover={{ x: 4 }}
                        className="text-purple-300 text-sm cursor-pointer"
                      >
                        Explore →
                      </motion.button>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-10">
                  No skills found matching your search. Try different keywords.
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Skills;
