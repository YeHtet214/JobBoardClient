import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Job, CreateJobDto, JobType } from '@/types/job.types';
import { useCreateJob, useUpdateJob } from '@/hooks/react-queries/job/useJobQueries';

// Job form validation schema
const JobSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title is too short')
    .max(100, 'Title is too long')
    .required('Job title is required'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description is too long')
    .required('Job description is required'),
  location: Yup.string()
    .required('Job location is required'),
  type: Yup.string()
    .oneOf(['FULL_TIME', 'PART_TIME', 'CONTRACT'], 'Invalid job type')
    .required('Job type is required'),
  salaryMin: Yup.number()
    .min(0, 'Minimum salary cannot be negative')
    .required('Minimum salary is required'),
  salaryMax: Yup.number()
    .min(0, 'Maximum salary cannot be negative')
    .moreThan(Yup.ref('salaryMin'), 'Maximum salary must be greater than minimum salary')
    .required('Maximum salary is required'),
  requiredSkills: Yup.array()
    .min(1, 'At least one required skill is needed')
    .required('Required skills are needed'),
  experienceLevel: Yup.string()
    .required('Experience level is required'),
  expiresAt: Yup.date()
    .min(new Date(), 'Expiry date cannot be in the past')
    .required('Expiry date is required'),
});

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
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(job?.requiredSkills || []);
  const formikRef = useRef<any>(null);

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
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
  };

  // Use useEffect to update Formik values when skills change
  useEffect(() => {
    // This will run whenever the skills array changes
    if (formikRef.current) {
      formikRef.current.setFieldValue('requiredSkills', skills);
    }
  }, [skills]);

  // Handle form submission
  const handleSubmit = async (values: CreateJobDto, { setSubmitting, setFieldValue }: any) => {
    try {
      // Set the skills in the form values before validation
      setFieldValue('requiredSkills', skills);
      
      // Check if skills array is empty
      if (skills.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one required skill",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      
      const jobData = {
        ...values,
        requiredSkills: skills, // Use the skills from state
      };

      if (isEditing && job) {
        await updateJob.mutateAsync({ id: job.id, job: jobData });
        toast({
          title: "Success",
          description: "Job posting has been updated successfully.",
        });
      } else {
        await createJob.mutateAsync(jobData);
        toast({
          title: "Success",
          description: "New job has been posted successfully.",
        });
      }
      navigate('/employer/jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if the form is submitting
  const isSubmitting = isEditing ? updateJob.isPending : createJob.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}</CardTitle>
        <CardDescription>
          Provide detailed information about the job to attract the right candidates
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={JobSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ errors, touched, isSubmitting: formikSubmitting, setFieldValue }) => (
          <Form>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  className={errors.title && touched.title ? "border-red-500" : ""}
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Describe the responsibilities, requirements, and benefits"
                  className={`min-h-[200px] ${errors.description && touched.description ? "border-red-500" : ""}`}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Location and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    placeholder="e.g. New York, NY or Remote"
                    className={errors.location && touched.location ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Field name="type">
                    {({ field, form }: any) => (
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => form.setFieldValue(field.name, value)}
                      >
                        <SelectTrigger className={errors.type && touched.type ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary ($)</Label>
                  <Field
                    as={Input}
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    placeholder="e.g. 50000"
                    className={errors.salaryMin && touched.salaryMin ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="salaryMin" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary ($)</Label>
                  <Field
                    as={Input}
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    placeholder="e.g. 70000"
                    className={errors.salaryMax && touched.salaryMax ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="salaryMax" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. React"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleAddSkill();
                      setFieldValue('requiredSkills', skills);
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-jobboard-purple/10 text-jobboard-purple rounded-full px-3 py-1 text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveSkill(skill);
                          setFieldValue('requiredSkills', skills);
                        }}
                        className="text-jobboard-purple hover:text-jobboard-purple/70 ml-1 h-4 w-4 rounded-full flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                {skills.length === 0 && errors.requiredSkills && (
                  <div className="text-red-500 text-sm">Please add at least one required skill</div>
                )}
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Field name="experienceLevel">
                  {({ field, form }: any) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => form.setFieldValue(field.name, value)}
                    >
                      <SelectTrigger className={errors.experienceLevel && touched.experienceLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="experienceLevel" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Job Posting Expires On</Label>
                <Field
                  as={Input}
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  className={errors.expiresAt && touched.expiresAt ? "border-red-500" : ""}
                />
                <ErrorMessage name="expiresAt" component="div" className="text-red-500 text-sm" />
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
                className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
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
