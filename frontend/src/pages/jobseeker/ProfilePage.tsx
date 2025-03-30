import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { profileService } from '../../services/profile.service';
import { Profile, Education, Experience, UpdateProfileDto } from '../../types/profile.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { X, Plus, Briefcase, GraduationCap, FileText, Github, Linkedin, Globe, Upload, AlertCircle, User, BookOpen, Building, Link } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

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
    const { currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser?.role !== 'JOBSEEKER') {
            navigate('/');
            return;
        }

        const fetchProfile = async () => {
            try {
                const profileData = await profileService.getMyProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // If profile doesn't exist yet, we'll create one with initial values
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser, navigate]);

    const handleSubmit = async (values: UpdateProfileDto) => {
        setSaving(true);
        try {
            let updatedProfile;

            if (profile.id) {
                updatedProfile = await profileService.updateProfile(values);
            } else {
                updatedProfile = await profileService.createProfile(values as any);
            }

            setProfile(updatedProfile);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setResumeUploadError('Please select a file to upload');
            return;
        }

        // Check file size (max 5MB)
        if (resumeFile.size > 5 * 1024 * 1024) {
            setResumeUploadError('File size exceeds the 5MB limit');
            return;
        }

        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(resumeFile.type)) {
            setResumeUploadError('Only PDF, DOC, and DOCX files are allowed');
            return;
        }

        setResumeUploadError(null);
        setResumeUploading(true);

        try {
            const resumeUrl = await profileService.uploadResume(resumeFile);

            // Update the profile state with the new resume URL
            setProfile(prevProfile => ({ ...prevProfile, resumeUrl }));

            // Clear the file input
            setResumeFile(null);

            // Show success message
            alert('Resume uploaded successfully!');
        } catch (error: any) {
            console.error('Error uploading resume:', error);

            // Provide more specific error message if available
            if (error.response && error.response.data && error.response.data.message) {
                setResumeUploadError(error.response.data.message);
            } else {
                setResumeUploadError('Failed to upload resume. Please try again.');
            }

            alert('Failed to upload resume. Please try again.');
        } finally {
            setResumeUploading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
        </div>;
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
                    initialValues={profile}
                    validationSchema={ProfileValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form className="space-y-6">
                            <TabsContent value="info" className="mt-0">
                                <Card className="border-none shadow-none">
                                    <CardHeader className="px-0 md:px-6">
                                        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Basic Information</CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Tell us about yourself
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-0 md:px-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Field
                                                as={Textarea}
                                                id="bio"
                                                name="bio"
                                                placeholder="Write a brief introduction about yourself..."
                                                className="min-h-32"
                                            />
                                            <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="skills">Skills</Label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <FieldArray
                                                    name="skills"
                                                    render={arrayHelpers => (
                                                        <>
                                                            {values?.skills && values.skills.map((skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    className="bg-jobboard-purple hover:bg-jobboard-purple/90 flex items-center gap-1 px-3 py-1.5"
                                                                >
                                                                    {skill}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                        className="ml-1 text-white hover:bg-jobboard-purple/70 rounded-full p-0.5"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </Badge>
                                                            ))}
                                                        </>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    placeholder="Add a skill..."
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (newSkill.trim()) {
                                                            setFieldValue('skills', [...values.skills, newSkill.trim()]);
                                                            setNewSkill('');
                                                        }
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4 mr-1" /> Add
                                                </Button>
                                            </div>
                                            <ErrorMessage name="skills" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between px-0 md:px-6">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('education')}>
                                            Next
                                        </Button>
                                        <Button type="submit" disabled={saving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
                                            {saving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="education" className="mt-0">
                                <Card className="border-none shadow-none">
                                    <CardHeader className="px-0 md:px-6">
                                        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Education</CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Add your educational background
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-0 md:px-6">
                                        <FieldArray
                                            name="education"
                                            render={arrayHelpers => (
                                                <div className="space-y-8">
                                                    {values?.education && values.education.length > 0 ? (
                                                        values.education.map((edu, index) => (
                                                            <div key={index} className="relative p-4 sm:p-6 border rounded-lg">
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                                    onClick={() => arrayHelpers.remove(index)}
                                                                >
                                                                    <X className="h-5 w-5" />
                                                                </button>

                                                                <div className="flex items-center mb-4">
                                                                    <GraduationCap className="mr-2 h-6 w-6 text-jobboard-purple" />
                                                                    <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`education.${index}.institution`}>Institution</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`education.${index}.institution`}
                                                                            name={`education.${index}.institution`}
                                                                            placeholder="e.g. Harvard University"
                                                                        />
                                                                        <ErrorMessage name={`education.${index}.institution`} component="div" className="text-red-500 text-sm" />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`education.${index}.degree`}>Degree</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`education.${index}.degree`}
                                                                            name={`education.${index}.degree`}
                                                                            placeholder="e.g. Bachelor of Science"
                                                                        />
                                                                        <ErrorMessage name={`education.${index}.degree`} component="div" className="text-red-500 text-sm" />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`education.${index}.fieldOfStudy`}>Field of Study</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`education.${index}.fieldOfStudy`}
                                                                            name={`education.${index}.fieldOfStudy`}
                                                                            placeholder="e.g. Computer Science"
                                                                        />
                                                                        <ErrorMessage name={`education.${index}.fieldOfStudy`} component="div" className="text-red-500 text-sm" />
                                                                    </div>

                                                                    <div className="space-y-2 col-span-2 flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`education.${index}.isCurrent`}
                                                                            name={`education.${index}.isCurrent`}
                                                                            checked={values.education[index].isCurrent}
                                                                            onChange={handleChange}
                                                                            className="mr-1"
                                                                        />
                                                                        <Label htmlFor={`education.${index}.isCurrent`}>I currently study here</Label>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
                                                                            <Field
                                                                                as={Input}
                                                                                type="date"
                                                                                id={`education.${index}.startDate`}
                                                                                name={`education.${index}.startDate`}
                                                                            />
                                                                            <ErrorMessage name={`education.${index}.startDate`} component="div" className="text-red-500 text-sm" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                                                                            <Field
                                                                                as={Input}
                                                                                type="date"
                                                                                id={`education.${index}.endDate`}
                                                                                name={`education.${index}.endDate`}
                                                                            />
                                                                            <ErrorMessage name={`education.${index}.endDate`} component="div" className="text-red-500 text-sm" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2 col-span-2">
                                                                        <Label htmlFor={`education.${index}.description`}>Description (Optional)</Label>
                                                                        <Field
                                                                            as={Textarea}
                                                                            id={`education.${index}.description`}
                                                                            name={`education.${index}.description`}
                                                                            placeholder="Add more details about your education..."
                                                                            className="min-h-20"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                                                            <p className="mt-4 text-gray-500">No education added yet. Add your first education entry.</p>
                                                        </div>
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full mt-4"
                                                        onClick={() => arrayHelpers.push({
                                                            institution: '',
                                                            degree: '',
                                                            fieldOfStudy: '',
                                                            startDate: '',
                                                            endDate: '',
                                                            isCurrent: false,
                                                            description: ''
                                                        })}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" /> Add Education
                                                    </Button>
                                                </div>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-between px-0 md:px-6">
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={() => setActiveTab('info')}>
                                                Previous
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setActiveTab('experience')}>
                                                Next
                                            </Button>
                                        </div>
                                        <Button type="submit" disabled={saving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
                                            {saving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="experience" className="mt-0">
                                <Card className="border-none shadow-none">
                                    <CardHeader className="px-0 md:px-6">
                                        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Work Experience</CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Add your work history to showcase your professional experience
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-0 md:px-6">
                                        <FieldArray
                                            name="experience"
                                            render={arrayHelpers => (
                                                <div className="space-y-8">
                                                    {values?.experience && values.experience.length > 0 ? (
                                                        values.experience.map((exp, index) => (
                                                            <div key={index} className="relative p-4 sm:p-6 border rounded-lg">
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                                                    onClick={() => arrayHelpers.remove(index)}
                                                                >
                                                                    <X className="h-5 w-5" />
                                                                </button>

                                                                <div className="flex items-center mb-4">
                                                                    <Briefcase className="mr-2 h-6 w-6 text-jobboard-purple" />
                                                                    <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`experience.${index}.company`}>Company</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`experience.${index}.company`}
                                                                            name={`experience.${index}.company`}
                                                                            placeholder="e.g. Google"
                                                                        />
                                                                        <ErrorMessage name={`experience.${index}.company`} component="div" className="text-red-500 text-sm" />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`experience.${index}.position`}>Position</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`experience.${index}.position`}
                                                                            name={`experience.${index}.position`}
                                                                            placeholder="e.g. Software Engineer"
                                                                        />
                                                                        <ErrorMessage name={`experience.${index}.position`} component="div" className="text-red-500 text-sm" />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <Label htmlFor={`experience.${index}.location`}>Location (Optional)</Label>
                                                                        <Field
                                                                            as={Input}
                                                                            id={`experience.${index}.location`}
                                                                            name={`experience.${index}.location`}
                                                                            placeholder="e.g. San Francisco, CA"
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2 col-span-2 flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`experience.${index}.isCurrent`}
                                                                            name={`experience.${index}.isCurrent`}
                                                                            checked={values.experience[index].isCurrent}
                                                                            onChange={handleChange}
                                                                            className="mr-1"
                                                                        />
                                                                        <Label htmlFor={`experience.${index}.isCurrent`}>I currently work here</Label>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                                                                            <Field
                                                                                as={Input}
                                                                                type="date"
                                                                                id={`experience.${index}.startDate`}
                                                                                name={`experience.${index}.startDate`}
                                                                            />
                                                                            <ErrorMessage name={`experience.${index}.startDate`} component="div" className="text-red-500 text-sm" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                                                                            <Field
                                                                                as={Input}
                                                                                type="date"
                                                                                id={`experience.${index}.endDate`}
                                                                                name={`experience.${index}.endDate`}
                                                                            />
                                                                            <ErrorMessage name={`experience.${index}.endDate`} component="div" className="text-red-500 text-sm" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2 col-span-2">
                                                                        <Label htmlFor={`experience.${index}.description`}>Description</Label>
                                                                        <Field
                                                                            as={Textarea}
                                                                            id={`experience.${index}.description`}
                                                                            name={`experience.${index}.description`}
                                                                            placeholder="Describe your role, responsibilities, and achievements..."
                                                                            className="min-h-20"
                                                                        />
                                                                        <ErrorMessage name={`experience.${index}.description`} component="div" className="text-red-500 text-sm" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                                                            <p className="mt-4 text-gray-500">No work experience added yet. Add your first work experience.</p>
                                                        </div>
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full mt-4"
                                                        onClick={() => arrayHelpers.push({
                                                            company: '',
                                                            position: '',
                                                            location: '',
                                                            startDate: '',
                                                            endDate: '',
                                                            isCurrent: false,
                                                            description: ''
                                                        })}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" /> Add Work Experience
                                                    </Button>
                                                </div>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-between px-0 md:px-6">
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={() => setActiveTab('education')}>
                                                Previous
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setActiveTab('links')}>
                                                Next
                                            </Button>
                                        </div>
                                        <Button type="submit" disabled={saving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
                                            {saving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="links" className="mt-0">
                                <Card className="border-none shadow-none">
                                    <CardHeader className="px-0 md:px-6">
                                        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Links & Resume</CardTitle>
                                        <CardDescription className="text-gray-500">
                                            Add your professional links and upload your resume
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 px-0 md:px-6">
                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <Linkedin className="h-5 w-5 text-jobboard-purple" />
                                                <div className="flex-1 space-y-2">
                                                    <Label htmlFor="linkedInUrl">LinkedIn Profile</Label>
                                                    <Field
                                                        as={Input}
                                                        id="linkedInUrl"
                                                        name="linkedInUrl"
                                                        placeholder="https://linkedin.com/in/yourprofile"
                                                    />
                                                    <ErrorMessage name="linkedInUrl" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <Github className="h-5 w-5 text-jobboard-purple" />
                                                <div className="flex-1 space-y-2">
                                                    <Label htmlFor="githubUrl">GitHub Profile</Label>
                                                    <Field
                                                        as={Input}
                                                        id="githubUrl"
                                                        name="githubUrl"
                                                        placeholder="https://github.com/yourusername"
                                                    />
                                                    <ErrorMessage name="githubUrl" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <Globe className="h-5 w-5 text-jobboard-purple" />
                                                <div className="flex-1 space-y-2">
                                                    <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                                                    <Field
                                                        as={Input}
                                                        id="portfolioUrl"
                                                        name="portfolioUrl"
                                                        placeholder="https://yourportfolio.com"
                                                    />
                                                    <ErrorMessage name="portfolioUrl" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </div>

                                            <Separator className="my-4" />

                                            <div className="space-y-4">
                                                <Label className="text-base font-semibold">Resume</Label>

                                                {profile && profile.resumeUrl ? (
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-md bg-gray-50 gap-3">
                                                        <div className="flex items-center">
                                                            <FileText className="h-5 w-5 text-jobboard-purple mr-3 flex-shrink-0" />
                                                            <div className="min-w-0">
                                                                <span className="text-sm font-medium block">Current Resume</span>
                                                                <span className="text-xs text-gray-500 truncate block">
                                                                    {profile.resumeUrl.split('/').pop()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => window.open(profile.resumeUrl, '_blank')}
                                                                className="w-full sm:w-auto"
                                                            >
                                                                View
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 border rounded-md bg-gray-50 text-center">
                                                        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-600">No resume uploaded yet.</p>
                                                        <p className="text-xs text-gray-500 mt-1">Upload your resume to increase your chances of getting hired.</p>
                                                    </div>
                                                )}

                                                <div className="space-y-2 mt-4">
                                                    <Label htmlFor="resume" className="text-sm font-medium">Upload New Resume</Label>
                                                    <div className="flex flex-col gap-3">
                                                        <Input
                                                            id="resume"
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    setResumeFile(e.target.files[0]);
                                                                    setResumeUploadError(null);
                                                                }
                                                            }}
                                                            className="cursor-pointer"
                                                        />

                                                        {resumeUploadError && (
                                                            <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                                                <AlertCircle className="h-4 w-4" />
                                                                {resumeUploadError}
                                                            </div>
                                                        )}

                                                        <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</p>

                                                        {resumeFile && (
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-gray-100 rounded-md">
                                                                <div className="flex items-center flex-1 min-w-0">
                                                                    <FileText className="h-4 w-4 text-jobboard-purple mr-2 flex-shrink-0" />
                                                                    <span className="text-sm truncate">{resumeFile.name}</span>
                                                                </div>
                                                                <span className="text-xs text-gray-500">
                                                                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                            </div>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            onClick={handleResumeUpload}
                                                            disabled={resumeUploading || !resumeFile}
                                                            className={`mt-2 w-full sm:w-auto ${!resumeFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {resumeUploading ? (
                                                                <>
                                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="h-4 w-4 mr-2" />
                                                                    Upload Resume
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between px-0 md:px-6">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('experience')}>
                                            Previous
                                        </Button>
                                        <Button type="submit" disabled={saving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
                                            {saving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Form>
                    )}
                </Formik>
            </Tabs>
        </div>
    );
};

export default ProfilePage;