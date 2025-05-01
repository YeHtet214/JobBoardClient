import React from 'react';
import { FormikProps } from 'formik';
import { ApplicationFormValues } from '@/types/application.types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionsTabProps {
  formik: FormikProps<ApplicationFormValues>;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Questions</h3>
      <p className="text-sm text-gray-500">
        Please answer these additional questions from the employer.
      </p>

      <div className="grid gap-6 py-4">
        {/* Availability */}
        <div className="grid gap-2">
          <div className={`${touched.availability && errors.availability ? 'error' : ''}`}>
            <Label htmlFor="availability">When can you start?</Label>
            <Input
              id="availability"
              name="availability"
              type="text"
              value={values.availability}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Immediately, 2 weeks, after June 15th, etc."
              className={`mt-1 ${touched.availability && errors.availability ? 'border-red-500' : ''}`}
            />
            {touched.availability && errors.availability && (
              <p className="text-red-500 text-xs mt-1">
                {errors.availability}
              </p>
            )}
          </div>
        </div>

        {/* Expected Salary */}
        <div className="grid gap-2">
          <div className={`${touched.expectedSalary && errors.expectedSalary ? 'error' : ''}`}>
            <Label htmlFor="expectedSalary">What is your expected salary?</Label>
            <Input
              id="expectedSalary"
              name="expectedSalary"
              type="text"
              value={values.expectedSalary}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., $70,000 - $80,000 per year"
              className={`mt-1 ${touched.expectedSalary && errors.expectedSalary ? 'border-red-500' : ''}`}
            />
            {touched.expectedSalary && errors.expectedSalary && (
              <p className="text-red-500 text-xs mt-1">
                {errors.expectedSalary}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid gap-2">
          <div>
            <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={values.additionalInfo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Share any additional information that might help your application..."
              className="min-h-[150px] mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsTab;
