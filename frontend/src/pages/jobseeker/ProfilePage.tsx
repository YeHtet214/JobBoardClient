import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Building, Link, Pencil, Calendar, MapPin, GraduationCap, Award, ArrowRight, PlusCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProfileQuery } from '@/hooks/useProfileQuery';
import { Profile } from '@/types/profile.types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import ProfileForm from '@/components/profile/ProfileForm';

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

  const {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    uploadResume,
    isCreating,
    isUpdating,
    isUploading
  } = useProfileQuery();

  // Redirect non-jobseekers
  useEffect(() => {
    if (currentUser?.role !== 'JOBSEEKER') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Reset edit mode when profile changes
  useEffect(() => {
    setEditMode(false);
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

        <Card className="border shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-jobboard-purple/10 to-jobboard-darkblue/10 pb-8">
            <CardTitle className="text-2xl text-jobboard-darkblue">Create Your Professional Profile</CardTitle>
            <CardDescription className="text-gray-600">
              Complete your profile to increase your chances of landing the perfect job
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="lg:w-1/3 flex justify-center">
                <div className="relative w-48 h-48 bg-jobboard-purple/10 rounded-full flex items-center justify-center">
                  <User className="h-24 w-24 text-jobboard-purple/60" />
                </div>
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <h3 className="text-xl font-semibold mb-3 text-jobboard-darkblue">Why Complete Your Profile?</h3>
                <ul className="space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                    <span>Showcase your skills and experience to potential employers</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                    <span>Get matched with jobs that align with your qualifications</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                    <span>Stand out from other candidates with a comprehensive profile</span>
                  </li>
                </ul>

                <Button
                  onClick={enterEditMode}
                  className="mt-4 bg-jobboard-darkblue hover:bg-jobboard-darkblue/90 text-white px-8 py-6 h-auto"
                >
                  <span className="mr-2">Create Profile</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="border shadow-md">
              <CardContent className="pt-6">
                <ProfileForm
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

        <Tabs value={viewTab} onValueChange={setViewTab} className="w-full">
          <TabsList className="w-full mb-8 bg-white border">
            <TabsTrigger value="overview" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-jobboard-purple/10 data-[state=active]:text-jobboard-darkblue">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-jobboard-purple/10 data-[state=active]:text-jobboard-darkblue">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-jobboard-purple/10 data-[state=active]:text-jobboard-darkblue">
              <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-jobboard-purple/10 data-[state=active]:text-jobboard-darkblue">
              <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Links & Resume</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-jobboard-purple text-white text-2xl">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl text-jobboard-darkblue">
                      {currentUser?.name || 'Job Seeker'}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {currentUser?.email || ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-jobboard-darkblue">Bio</h3>
                    <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-jobboard-darkblue">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill, i) => (
                        <Badge key={i} className="bg-jobboard-purple/20 text-jobboard-darkblue hover:bg-jobboard-purple/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-jobboard-darkblue">Education</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.education?.length > 0 ? (
                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div key={edu.id || index} className="border-b pb-5 last:border-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <h3 className="text-md font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              <span>{edu.institution}</span>
                            </div>
                          </div>
                          <div className="mt-1 md:mt-0 flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>
                              {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                            </span>
                          </div>
                        </div>
                        {edu.description && (
                          <p className="mt-2 text-gray-700">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No education information added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-jobboard-darkblue">Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.experience?.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={exp.id || index} className="border-b pb-5 last:border-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <h3 className="text-md font-semibold text-gray-900">{exp.position}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              <span>{exp.company}</span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center text-gray-500 mt-1 text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1 md:mt-0 flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>
                              {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Building className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No work experience added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-jobboard-darkblue">Links & Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(profile.linkedInUrl || profile.githubUrl || profile.portfolioUrl) ? (
                    <div className="space-y-3">
                      {profile.linkedInUrl && (
                        <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                          <Badge className="bg-[#0077B5] hover:bg-[#0077B5]/90">LinkedIn</Badge>
                          {profile.linkedInUrl}
                        </a>
                      )}
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                          <Badge className="bg-[#333] hover:bg-[#333]/90">GitHub</Badge>
                          {profile.githubUrl}
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                          <Badge className="bg-jobboard-purple hover:bg-jobboard-purple/90">Portfolio</Badge>
                          {profile.portfolioUrl}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No links added yet</p>
                  )}

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-md font-semibold mb-3 text-gray-900">Resume</h3>
                    {profile.resumeUrl ? (
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-jobboard-purple rounded-md text-sm font-medium text-jobboard-purple hover:bg-jobboard-purple/10"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        View Resume
                      </a>
                    ) : (
                      <p className="text-gray-500">No resume uploaded yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
          <ProfileForm
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