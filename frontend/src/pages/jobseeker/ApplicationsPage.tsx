import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJob } from '@/hooks/react-queries/job/useJobQueries';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, FileText, MessageSquare, HelpCircle, CheckCircle } from 'lucide-react';
import Progress from '@/components/ui/Progress';
import { ApplicationFormValues } from '@/types/application.types';
import { 
  PersonalInfoTab, 
  ResumeTab, 
  CoverLetterTab, 
  QuestionsTab, 
  ReviewTab 
} from '@/components/application-form';

// Define validation schema
const ApplicationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),

    resume: Yup.mixed()
        .test('fileRequired',
            'Please upload your resume or use existing one',
            function (value) {
                return this.parent.useExistingResume || value !== null;
            }),

    coverLetter: Yup.string().required('Cover letter is required'),

    availability: Yup.string().required('Please specify your availability'),
    expectedSalary: Yup.string().required('Expected salary is required'),

    acceptTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
});

const ApplicationPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { data: job } = useJob(jobId || '');
    const [activeTab, setActiveTab] = useState("personal");
    const [progress, setProgress] = useState(20);

    const initialValues: ApplicationFormValues = {
        fullName: '',
        email: '',
        phone: '',
        resume: null,
        useExistingResume: false,
        coverLetter: '',
        availability: '',
        expectedSalary: '',
        additionalInfo: '',
        acceptTerms: false
    };

    const handleSubmit = (values: ApplicationFormValues) => {
        console.log('Form submitted:', values);
        // TODO: Call application service to submit the application

        // Navigate to success page or applications list
        // navigate('/jobseeker/applications');
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);

        // Update progress based on active tab
        const progressMap: Record<string, number> = {
            personal: 20,
            resume: 40,
            coverLetter: 60,
            questions: 80,
            review: 100
        };

        setProgress(progressMap[tab] || 0);
    };

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Apply for {job?.title || 'Job'}</CardTitle>
                    <CardDescription>
                        {job?.company?.name || 'Company'} • {job?.location || 'Location'}
                    </CardDescription>
                    <Progress value={progress} />
                </CardHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={ApplicationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => (
                        <Form>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                    <TabsList className="grid grid-cols-5 mb-8">
                                        <TabsTrigger value="personal" className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                            <User className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">Personal</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="resume" className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">Resume</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="coverLetter" className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">Cover Letter</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="questions" className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">Questions</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="review" className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm">Review</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Personal Info Tab */}
                                    <TabsContent value="personal">
                                        <PersonalInfoTab formik={formik} />
                                    </TabsContent>

                                    {/* Resume Tab */}
                                    <TabsContent value="resume">
                                        <ResumeTab formik={formik} />
                                    </TabsContent>

                                    {/* Cover Letter Tab */}
                                    <TabsContent value="coverLetter">
                                        <CoverLetterTab formik={formik} />
                                    </TabsContent>

                                    {/* Additional Questions Tab */}
                                    <TabsContent value="questions">
                                        <QuestionsTab formik={formik} />
                                    </TabsContent>

                                    {/* Review & Submit Tab */}
                                    <TabsContent value="review">
                                        <ReviewTab 
                                            formik={formik} 
                                            jobTitle={job?.title} 
                                            companyName={job?.company?.name} 
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>

                            <CardFooter className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const tabs = ["personal", "resume", "coverLetter", "questions", "review"];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        if (currentIndex > 0) {
                                            handleTabChange(tabs[currentIndex - 1]);
                                        }
                                    }}
                                    disabled={activeTab === "personal"}
                                >
                                    Previous
                                </Button>

                                {activeTab === "review" ? (
                                    <Button type="submit" disabled={formik.isSubmitting}>
                                        Submit Application
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const tabs = ["personal", "resume", "coverLetter", "questions", "review"];
                                            const currentIndex = tabs.indexOf(activeTab);
                                            if (currentIndex < tabs.length - 1) {
                                                handleTabChange(tabs[currentIndex + 1]);
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </CardFooter>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default ApplicationPage;