import React from 'react';
import { FormikProps } from 'formik';
import { ApplicationFormValues } from '@/types/application.types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CoverLetterTabProps {
  formik: FormikProps<ApplicationFormValues>;
}

const CoverLetterTab: React.FC<CoverLetterTabProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Cover Letter</h3>
      <p className="text-sm text-gray-500">
        Tell the employer why you're a good fit for this position.
      </p>

      <div className="grid gap-4 py-4">
        <div className={`grid gap-2 ${touched.coverLetter && errors.coverLetter ? 'error' : ''}`}>
          <Label htmlFor="coverLetter">Your Cover Letter</Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            placeholder="Write your cover letter here..."
            value={values.coverLetter}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`min-h-[300px] ${touched.coverLetter && errors.coverLetter ? 'border-red-500' : ''}`}
          />
          {touched.coverLetter && errors.coverLetter && (
            <p className="text-red-500 text-xs mt-1">
              {errors.coverLetter}
            </p>
          )}
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Tips for a great cover letter:
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-500 mt-1 space-y-1">
            <li>Introduce yourself and explain why you're interested in this position</li>
            <li>Highlight your most relevant skills and experience</li>
            <li>Explain how your background makes you a good fit</li>
            <li>End with a call to action, inviting the employer to contact you</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTab;
