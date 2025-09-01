import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <p className="text-lg">{user.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <p className="text-lg">{user.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <span className={`px-2 py-1 rounded-full text-xs ${
              user.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button>Edit Profile</Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <p className="text-lg capitalize">{user.preferences.theme}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notifications</label>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Email notifications</span>
                <span>{user.preferences.notifications.email ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between">
                <span>Push notifications</span>
                <span>{user.preferences.notifications.push ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between">
                <span>Reservation reminders</span>
                <span>{user.preferences.notifications.reservationReminders ? '✅' : '❌'}</span>
              </div>
              <div className="flex justify-between">
                <span>Promotional emails</span>
                <span>{user.preferences.notifications.promotions ? '✅' : '❌'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline">Update Preferences</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
