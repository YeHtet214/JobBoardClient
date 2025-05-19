import React from 'react';
import { FormikProps } from 'formik';
import { CreateApplicationDto } from '@/types/application.types';
import { InputFieldWithLabel } from '../forms';

interface PersonalInfoTabProps {
  formik: FormikProps<CreateApplicationDto>;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ formik }) => {

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <p className="text-sm text-gray-500">
        Please provide your contact information below.
      </p>

      <div className="grid gap-4 py-4">
        {/* Full Name */}
        <div className="grid gap-2">
          <InputFieldWithLabel
            name="fullName"
            label="Full Name"
            type="text"
            required={true}
            formik={true}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <InputFieldWithLabel
            name="email"
            label="Email Address"
            type="email"
            required={true}
            formik={true}
            placeholder="Enter your email address"
          />
        </div>

        {/* Phone Number */}
        <div className="grid gap-2">
          <InputFieldWithLabel
            name="phone"
            label="Phone Number"
            type="tel"
            required={true}
            formik={true}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
