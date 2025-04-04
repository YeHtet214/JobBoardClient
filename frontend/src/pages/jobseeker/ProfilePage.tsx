import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { User, BookOpen, Building, Link } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useProfileQuery } from '../../hooks/useProfileQuery';
import BasicInfoTab from '../../components/profile/BasicInfoTab';
import EducationTab from '../../components/profile/EducationTab';
import ExperienceTab from '../../components/profile/ExperienceTab';
import LinksTab from '../../components/profile/LinksTab';
import { Profile } from '../../types/profile.types';

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

const ProfileValidationSchema = Yup.object().shape({
    bio: Yup.string().required('Bio is required'),
    skills: Yup.array().of(Yup.string()).min(1, 'Add at least one skill'),
    education: Yup.array().of(
        Yup.object().shape({
            institution: Yup.string().required('Institution is required'),
            degree: Yup.string().required('Degree is required'),
            fieldOfStudy: Yup.string().required('Field of study is required'),
            startDate: Yup.string().required('Start date is required'),
            endDate: Yup.string().when('isCurrent', {
                is: false,
                then: Yup.string().required('End date is required'),
                otherwise: Yup.string()
            }),
        })
    ),
    experience: Yup.array().of(
        Yup.object().shape({
            company: Yup.string().required('Company is required'),
            position: Yup.string().required('Position is required'),
            description: Yup.string().required('Description is required'),
            startDate: Yup.string().required('Start date is required'),
            endDate: Yup.string().when('isCurrent', {
                is: false,
                then: Yup.string().required('End date is required'),
                otherwise: Yup.string()
            }),
        })
    ),
    linkedInUrl: Yup.string().url('Must be a valid URL'),
    githubUrl: Yup.string().url('Must be a valid URL'),
    portfolioUrl: Yup.string().url('Must be a valid URL'),
});

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    
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

    const handleSubmit = async (values: Profile) => {
        try {
            if (profile?.id) {
                await updateProfile(values);
            } else {
                await createProfile(values as any);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleResumeUpload = async (file: File) => {
        await uploadResume(file);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">Profile</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-8">
                    <TabsTrigger value="info" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 hidden md:inline-block" />
                        <span>Basic Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 hidden md:inline-block" />
                        <span>Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
                        <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 hidden md:inline-block" />
                        <span>Experience</span>
                    </TabsTrigger>
                    <TabsTrigger value="links" className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap">
                        <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 hidden md:inline-block" />
                        <span>Links & Resume</span>
                    </TabsTrigger>
                </TabsList>

                <Formik
                    initialValues={profile || initialProfile}
                    validationSchema={ProfileValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(formik) => (
                        <Form className="space-y-6">
                            <TabsContent value="info" className="mt-0">
                                <BasicInfoTab 
                                    formik={formik} 
                                    isSaving={isCreating || isUpdating} 
                                    onTabChange={setActiveTab} 
                                />
                            </TabsContent>

                            <TabsContent value="education" className="mt-0">
                                <EducationTab 
                                    formik={formik} 
                                    isSaving={isCreating || isUpdating} 
                                    onTabChange={setActiveTab} 
                                />
                            </TabsContent>

                            <TabsContent value="experience" className="mt-0">
                                <ExperienceTab 
                                    formik={formik} 
                                    isSaving={isCreating || isUpdating} 
                                    onTabChange={setActiveTab} 
                                />
                            </TabsContent>

                            <TabsContent value="links" className="mt-0">
                                <LinksTab 
                                    formik={formik} 
                                    isSaving={isCreating || isUpdating} 
                                    onTabChange={setActiveTab}
                                    onResumeUpload={handleResumeUpload}
                                    isResumeUploading={isUploading}
                                />
                            </TabsContent>
                        </Form>
                    )}
                </Formik>
            </Tabs>
        </div>
    );
};

export default ProfilePage;