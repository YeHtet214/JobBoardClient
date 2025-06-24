import { useState, useEffect, useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Job, CreateJobDto, JobType } from '@/types/job.types';
import { useCreateJob, useUpdateJob } from '@/hooks/react-queries/job/useJobQueries';
import {
  Form,
  InputFieldWithLabel,
  TextareaField,
  SelectFieldWithLabel,
  MultiSelectFieldWithLabel,
  DatePickerFieldWithLabel
} from '@/components/forms';
import { JobSchema } from '@/schemas/validation/job.schema';

interface JobPostFormProps {
  job?: Job;
  isEditing?: boolean;
}

// Job type options
const jobTypeOptions = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
];

// Experience level options
const experienceLevelOptions = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level' },
  { value: 'MID_LEVEL', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'EXECUTIVE', label: 'Executive' },
];

const JobPostForm = ({ job, isEditing = false }: JobPostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>(job?.requiredSkills || []);
  const formikRef = useRef<any>(null);

  useEffect(() => setSkills(job?.requiredSkills || []), [job]);

  // React Query mutations
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const initialValues: CreateJobDto = {
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    type: job?.type || 'FULL_TIME' as JobType,
    salaryMin: job?.salaryMin || 0,
    salaryMax: job?.salaryMax || 0,
    requiredSkills: job?.requiredSkills || [],
    experienceLevel: job?.experienceLevel || 'ENTRY_LEVEL',
    expiresAt: job?.expiresAt ? new Date(job.expiresAt).toISOString().split('T')[0] :
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
  };

  // Handle skill input
  // const handleAddSkill = () => {
  //   if (skillInput.trim() && !skills.includes(skillInput.trim())) {
  //     const newSkills = [...skills, skillInput.trim()];
  //     setSkills(newSkills);
  //     setSkillInput('');
  //   }
  // };

  // const handleRemoveSkill = (skillToRemove: string) => {
  //   const newSkills = skills.filter(skill => skill !== skillToRemove);
  //   setSkills(newSkills);
  // };

  // Use useEffect to update Formik values when skills change
  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setFieldValue('requiredSkills', skills);
    }
  }, [skills]);

  // Handle form submission
  const handleSubmit = async (values: CreateJobDto, { setSubmitting }: FormikHelpers<CreateJobDto>) => {
    try {
      // Ensure required skills are set
      if (values.requiredSkills.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one required skill",
          variant: "destructive"
        });
        return;
      }

      // Submit the form
      if (isEditing && job) {
        await updateJob.mutateAsync({ id: job.id, job: values });
        toast({
          title: "Job Updated",
          description: "Your job posting has been updated successfully",
        });
      } else {
        await createJob.mutateAsync(values);
        toast({
          title: "Job Posted",
          description: "Your job posting has been created successfully",
        });
      }

      // Navigate to job listings after successful submission
      navigate('/employer/jobs');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formikSubmitting = createJob.isPending || updateJob.isPending;

  // Convert required skills to options format for MultiSelectFieldWithLabel
  const skillsAsOptions = skills.map(skill => ({ value: skill, label: skill }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Job' : 'Post a New Job'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update your job posting' : 'Create a new job posting to attract the best candidates'}
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={JobSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ isSubmitting }) => (
          <Form>
            <CardContent className="space-y-6">
              <InputFieldWithLabel
                formik={true}
                name="title"
                label="Job Title"
                placeholder="e.g. Senior React Developer"
                required
                disabled={isSubmitting || formikSubmitting}
              />

              <TextareaField
                formik={true}
                name="description"
                label="Job Description"
                placeholder="Describe the job responsibilities, requirements, benefits, etc."
                rows={8}
                required
                disabled={isSubmitting || formikSubmitting}
              />

              <InputFieldWithLabel
                formik={true}
                name="location"
                label="Location"
                placeholder="e.g. New York, NY or Remote"
                required
                disabled={isSubmitting || formikSubmitting}
              />

              <SelectFieldWithLabel
                formik={true}
                name="type"
                label="Job Type"
                options={jobTypeOptions}
                placeholder="Select job type"
                required
                disabled={isSubmitting || formikSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputFieldWithLabel
                  formik={true}
                  name="salaryMin"
                  label="Minimum Salary"
                  placeholder="e.g. 50000"
                  required
                  disabled={isSubmitting || formikSubmitting}
                />

                <InputFieldWithLabel
                  formik={true}
                  name="salaryMax"
                  label="Maximum Salary"
                  placeholder="e.g. 80000"
                  required
                  disabled={isSubmitting || formikSubmitting}
                />
              </div>

              <MultiSelectFieldWithLabel
                formik={true}
                name="requiredSkills"
                label="Required Skills"
                options={skillsAsOptions}
                placeholder="Enter skills needed for this job"
                allowCreation={true}
                creationLabel="Add skill:"
                disabled={isSubmitting || formikSubmitting}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <SelectFieldWithLabel
                  formik={true}
                  name="experienceLevel"
                  label="Experience Level"
                  options={experienceLevelOptions}
                  placeholder="Select experience level"
                  required
                  disabled={isSubmitting || formikSubmitting}
                />

                <DatePickerFieldWithLabel
                  formik={true}
                  name="expiresAt"
                  label="Job Posting Expires On"
                  required
                  disabled={isSubmitting || formikSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employer/jobs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-jb-primary text-white hover:bg-jb-primary/90"
                disabled={isSubmitting || formikSubmitting}
              >
                {isSubmitting || formikSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Updating...' : 'Posting...'}
                  </>
                ) : (
                  isEditing ? 'Update Job' : 'Post Job'
                )}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default JobPostForm;
