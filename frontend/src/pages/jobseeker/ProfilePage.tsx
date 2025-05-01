import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Profile } from '@/types/profile.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useProfile, useCreateProfile, useUpdateProfile, useUploadResume } from '@/hooks/react-queries/profile/useProfileQueries';

import ProfileOverview from '@/components/jobseeker/profile/ProfileOverview';
import ProfileTabs from '@/components/jobseeker/profile/ProfileTabs';
import ProfileEditForm from '@/components/jobseeker/profile/form/ProfileEditForm';

const initialProfile: Profile = {
  id: '',
  userId: '',
  bio: '',
  skills: [],
  education: [],
  experience: [],
  resumeUrl: '',
  linkedInUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  createdAt: '',
  updatedAt: ''
};

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [viewTab, setViewTab] = useState('overview');

  const { data: profile, isLoading } = useProfile();
  const { mutate: createProfile, isPending: isCreating } = useCreateProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadResume, isPending: isUploading } = useUploadResume();

  // Redirect non-jobseekers
  useEffect(() => {
    if (currentUser?.role !== 'JOBSEEKER') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Reset edit mode when profile changes
  useEffect(() => {
    setEditMode(false);
    console.log("Profile changed: ", profile);
  }, [profile]);

  const handleSubmit = async (values: Profile) => {
    try {
      if (profile?.id) {
        await updateProfile(values);
      } else {
        await createProfile(values as any);
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleResumeUpload = async (file: File) => {
    await uploadResume(file);
  };

  const enterEditMode = () => {
    setEditMode(true);
    setActiveTab('info');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // No profile exists yet
  if (!profile?.id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl py-10 px-4 sm:px-6"
      >
        <h1 className="text-3xl font-bold mb-4 text-jobboard-darkblue">Profile</h1>
        <ProfileOverview enterEditMode={enterEditMode} />
        
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border shadow-md">
              <CardContent className="pt-6">
                <ProfileEditForm
                  profile={initialProfile}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleSubmit={handleSubmit}
                  handleResumeUpload={handleResumeUpload}
                  isCreating={isCreating}
                  isUpdating={isUpdating}
                  isUploading={isUploading}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Profile exists - Display mode
  if (!editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl py-10 px-4 sm:px-6"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-jobboard-darkblue">Profile</h1>
          <Button
            onClick={enterEditMode}
            variant="outline"
            className="flex items-center gap-2 border-jobboard-darkblue text-jobboard-darkblue hover:bg-jobboard-darkblue/10"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>

        <ProfileTabs 
          profile={profile} 
          viewTab={viewTab} 
          setViewTab={setViewTab} 
        />
      </motion.div>
    );
  }

  // Edit mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-5xl py-10 px-4 sm:px-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-jobboard-darkblue">Edit Profile</h1>
        <Button
          onClick={() => setEditMode(false)}
          variant="outline"
          className="border-gray-300"
        >
          Cancel
        </Button>
      </div>

      <Card className="border shadow-md">
        <CardContent className="pt-6">
          <ProfileEditForm
            profile={profile || initialProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleSubmit={handleSubmit}
            handleResumeUpload={handleResumeUpload}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;