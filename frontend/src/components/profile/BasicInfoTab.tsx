import { useState } from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { X, Plus, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { FormikProps } from 'formik';
import { Profile } from '../../types/profile.types';
import LoadingSpinner from '../ui/LoadingSpinner';

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
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Field
            as={Textarea}
            id="bio"
            name="bio"
            placeholder="Write a brief introduction about yourself..."
            className="min-h-32"
          />
          <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
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
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="flex-1"
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
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <ErrorMessage name="skills" component="div" className="text-red-500 text-sm" />
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
