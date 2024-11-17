import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Lock, Smartphone, Mail } from 'lucide-react';

export default function SecuritySettings() {
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: ''
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      // Show error toast
      return;
    }
    try {
      await updatePassword(formData.currentPassword, formData.newPassword);
      setShowPasswordForm(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmail(formData.newEmail);
      setShowEmailForm(false);
      setFormData({ ...formData, newEmail: '' });
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Login & Security</h2>

      <div className="space-y-6">
        {/* Email Section */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-semibold">Email Address</h3>
            </div>
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="text-accent-400 hover:text-accent-300"
            >
              Change
            </button>
          </div>
          
          {showEmailForm ? (
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Email</label>
                <input
                  type="email"
                  value={formData.newEmail}
                  onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent-600 rounded-lg hover:bg-accent-700"
                >
                  Update Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-white/70">{currentUser?.email}</p>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-semibold">Password</h3>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-accent-400 hover:text-accent-300"
            >
              Change
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent-600 rounded-lg hover:bg-accent-700"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-accent-400" />
              <div>
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-white/70">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10">
              Set Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}