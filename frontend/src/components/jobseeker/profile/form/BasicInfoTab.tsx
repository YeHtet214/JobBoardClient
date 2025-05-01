import { useState } from 'react';
import { FieldArray, FormikProps } from 'formik';
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
import { Profile } from '@/types/profile.types';
import { TextareaField, InputField } from '@/components/forms';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BasicInfoTabProps {
  formik: FormikProps<Profile>;
  isSaving: boolean;
  onTabChange: (tab: string) => void;
}

const BasicInfoTab = ({ formik, isSaving, onTabChange }: BasicInfoTabProps) => {
  const [newSkill, setNewSkill] = useState('');
  const { values, setFieldValue } = formik;

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
            <InputField
              formik={false}
              name="newSkill"
              label=""
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="flex-1"
              errors={{}}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newSkill.trim()) {
                  setFieldValue('skills', [...(values.skills || []), newSkill.trim()]);
                  setNewSkill('');
                }
              }}
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
        <Button type="submit" disabled={isSaving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
          {isSaving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BasicInfoTab;
