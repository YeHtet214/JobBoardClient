import React from 'react';
import { FormikProps } from 'formik';
import { ApplicationFormValues } from '@/types/application.types';
// import { 
//   FormControl,
//   FormItem, 
//   FormLabel, 
//   FormMessage 
// } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  User, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  ClipboardList 
} from 'lucide-react';

interface ReviewTabProps {
  formik: FormikProps<ApplicationFormValues>;
  jobTitle?: string;
  companyName?: string;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ formik, jobTitle, companyName }) => {
  const { values, errors, touched, handleChange } = formik;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Review & Submit</h3>
      <p className="text-sm text-gray-500">
        Please review your application before submitting.
      </p>

      <div className="grid gap-6 py-4">
        {/* Personal Information Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Full Name:</span> 
                <span className="ml-1 font-medium">{values.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span> 
                <span className="ml-1 font-medium">{values.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> 
                <span className="ml-1 font-medium">{values.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {values.useExistingResume ? (
              <div className="text-sm">Using resume from your profile</div>
            ) : values.resume ? (
              <div className="text-sm">
                <span className="text-gray-500">Resume File:</span> 
                <span className="ml-1 font-medium">{values.resume.name}</span>
              </div>
            ) : (
              <div className="text-sm text-yellow-600">No resume uploaded</div>
            )}
          </CardContent>
        </Card>

        {/* Cover Letter Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-md">
              {values.coverLetter || (
                <span className="text-yellow-600">No cover letter provided</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Questions Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Additional Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="text-gray-500">Availability:</span> 
              <span className="ml-1 font-medium">{values.availability}</span>
            </div>
            <div>
              <span className="text-gray-500">Expected Salary:</span> 
              <span className="ml-1 font-medium">{values.expectedSalary}</span>
            </div>
            {values.additionalInfo && (
              <div>
                <span className="text-gray-500">Additional Information:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  {values.additionalInfo}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="text-gray-500">Position:</span> 
              <span className="ml-1 font-medium">{jobTitle || 'Unknown Position'}</span>
            </div>
            <div>
              <span className="text-gray-500">Company:</span> 
              <span className="ml-1 font-medium">{companyName || 'Unknown Company'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          {/* <FormItem className={`${touched.acceptTerms && errors.acceptTerms ? 'error' : ''}`}>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={values.acceptTerms}
                  onCheckedChange={() => formik.setFieldValue('acceptTerms', !values.acceptTerms)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <Label htmlFor="acceptTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I confirm that all the information provided is accurate and complete
                </Label>
              </div>
            </div>
            {touched.acceptTerms && errors.acceptTerms && (
              <FormMessage className="text-red-500 text-xs mt-1">
                {errors.acceptTerms as string}
              </FormMessage>
            )}
          </FormItem> */}
        </div>
      </div>
    </div>
  );
};

export default ReviewTab;
