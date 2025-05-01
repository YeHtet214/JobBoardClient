import { FormikProps } from 'formik';
import { FieldArray } from 'formik';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextareaField, InputFieldWithLabel } from '@/components/forms';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ProfileFormValues } from './ProfileEditForm';

interface BasicInfoTabProps {
  formik: FormikProps<ProfileFormValues>;
  isSaving: boolean;
  onTabChange: (tab: string) => void;
}

const BasicInfoTab = ({ formik, isSaving, onTabChange }: BasicInfoTabProps) => {
  const { values, setFieldValue } = formik;

  // Function to handle adding a new skill
  const handleAddSkill = () => {
    // Get the new skill value from formik (could be defined in initialValues)
    const skillToAdd = values.newSkill?.trim();

    // Add the skill if it's not empty and not already in the list
    if (skillToAdd && (!values.skills || !values.skills.includes(skillToAdd))) {
      // Update the skills array
      setFieldValue('skills', [...(values.skills || []), skillToAdd]);

      // Clear the input field
      setFieldValue('newSkill', '');
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Basic Information</CardTitle>
        <CardDescription className="text-gray-500">
          Tell us about yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <TextareaField
          formik={true}
          name="bio"
          label="Bio"
          placeholder="Write a brief introduction about yourself..."
          className="min-h-32"
          rows={6}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
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
            <InputFieldWithLabel
              formik={true}
              name="newSkill"
              label=""
              type="text"
              placeholder="Add a skill..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              className="mt-1"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-0 md:px-6">
        <Button type="button" variant="outline" onClick={() => onTabChange('education')}>
          Next
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BasicInfoTab;
