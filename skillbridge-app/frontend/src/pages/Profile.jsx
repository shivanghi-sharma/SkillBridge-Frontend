/* ============================================================
   Profile Page – edit user profile
   Features: name/bio/skills/rate/location form, avatar
   preview, add/remove skill tags, change password section.
   ============================================================ */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser, FiSave, FiPlus, FiX, FiLock,
  FiMapPin, FiDollarSign, FiEdit3, FiUpload,
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';
import Toast from '../components/Toast';
import { fadeInUp, staggerContainer } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  /* ── Profile form state ──────────────────────────── */
  const [profile, setProfile] = useState({
    fullName: user?.email?.split('@')[0] || '',
    bio: 'Passionate developer and lifelong learner. Always excited to share knowledge and collaborate on exciting projects.',
    hourlyRate: '299',
    location: 'New Delhi, India',
  });

  /* ── Skills state ────────────────────────────────── */
  const [skills, setSkills] = useState(['React', 'Node.js', 'JavaScript', 'UI/UX']);
  const [newSkill, setNewSkill] = useState('');

  /* ── Password state ──────────────────────────────── */
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setToast({ message: 'Profile updated successfully! ✨', type: 'success' });
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setToast({ message: 'Skill already added', type: 'error' });
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setToast({ message: 'Passwords do not match!', type: 'error' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setToast({ message: 'Password changed successfully! 🔒', type: 'success' });
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <PageTransition>
      <section className="section-padding pt-28">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Edit Profile" subtitle="Your Account" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* ── Avatar + Basic Info ──────────────────── */}
            <motion.div variants={fadeInUp}>
              <GlassCard>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  {/* Avatar preview */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl animated-gradient flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                      {initials}
                    </div>
                    <label className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FiUpload className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={() => setToast({ message: 'Avatar upload feature coming soon!', type: 'info' })} />
                    </label>
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">
                      {profile.fullName || 'Your Name'}
                    </h2>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <p className="text-purple-300 text-xs mt-1">
                      Member since April 2026
                    </p>
                  </div>
                </div>

                {/* Profile form */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                      <FiUser className="w-3 h-3 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                      <FiEdit3 className="w-3 h-3 inline mr-1" />
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Hourly Rate */}
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                        <FiDollarSign className="w-3 h-3 inline mr-1" />
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={profile.hourlyRate}
                        onChange={(e) => handleProfileChange('hourlyRate', e.target.value)}
                        placeholder="e.g. 299"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                        <FiMapPin className="w-3 h-3 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        placeholder="City, Country"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168,85,247,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl animated-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/25 cursor-pointer"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Profile
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>

            {/* ── My Skills ────────────────────────────── */}
            <motion.div variants={fadeInUp}>
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)]">
                  My Skills
                </h3>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 text-sm border border-purple-500/20"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-purple-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>

                {/* Add skill input */}
                <form onSubmit={addSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl animated-gradient text-white text-sm font-semibold cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>

            {/* ── Change Password ──────────────────────── */}
            <motion.div variants={fadeInUp}>
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4 font-[var(--font-heading)] flex items-center gap-2">
                  <FiLock className="w-5 h-5 text-purple-400" />
                  Change Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwords.oldPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, oldPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all text-sm font-semibold cursor-pointer"
                  >
                    <FiLock className="w-4 h-4" />
                    Update Password
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageTransition>
  );
};

export default Profile;
