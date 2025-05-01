import React from 'react';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { ApplicationFormValues } from '@/types/application.types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInfoTabProps {
  formik: FormikProps<ApplicationFormValues>;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <p className="text-sm text-gray-500">
        Please provide your contact information below.
      </p>

      <div className="grid gap-4 py-4">
        {/* Full Name */}
        <div className="grid gap-2">
          <div className={`${touched.fullName && errors.fullName ? 'error' : ''}`}>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={`mt-1 ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <div className={`${touched.email && errors.email ? 'error' : ''}`}>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className={`mt-1 ${touched.email && errors.email ? 'border-red-500' : ''}`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="grid gap-2">
          <div className={`${touched.phone && errors.phone ? 'error' : ''}`}>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              className={`mt-1 ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
