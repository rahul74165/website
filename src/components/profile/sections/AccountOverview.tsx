import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountOverview() {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || currentUser?.displayName || '',
    phone: userProfile?.phone || '',
    email: currentUser?.email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
      
      <div className="bg-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-accent-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold">
              {userProfile?.name || currentUser?.displayName || 'User'}
            </h3>
            <p className="text-white/70">{currentUser?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: userProfile?.name || currentUser?.displayName || '',
                    phone: userProfile?.phone || '',
                    email: currentUser?.email || ''
                  });
                }}
                className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70">Phone Number</p>
              <p className="font-medium">{userProfile?.phone || 'Not set'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Account Status</h3>
          <p className="text-white/70">Member since: {new Date(userProfile?.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Account Security</h3>
          <p className="text-white/70">Last login: {new Date(currentUser?.metadata.lastSignInTime || '').toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}