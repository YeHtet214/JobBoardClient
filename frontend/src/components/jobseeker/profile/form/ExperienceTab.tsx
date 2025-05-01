import { Field, FieldArray, ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { FormikProps } from 'formik';
import { Profile } from '@/types/profile.types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ExperienceTabProps {
  formik: FormikProps<Profile>;
  isSaving: boolean;
  onTabChange: (tab: string) => void;
}

const ExperienceTab = ({ formik, isSaving, onTabChange }: ExperienceTabProps) => {
  const { values, handleChange } = formik;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Work Experience</CardTitle>
        <CardDescription className="text-gray-500">
          Add your work history to showcase your professional experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <FieldArray
          name="experience"
          render={arrayHelpers => (
            <div className="space-y-8">
              {values?.experience && values.experience.length > 0 ? (
                values.experience.map((_, index) => (
                  <div key={index} className="relative p-4 sm:p-6 border rounded-lg">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center mb-4">
                      <Briefcase className="mr-2 h-6 w-6 text-jobboard-purple" />
                      <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`experience.${index}.company`}>Company</Label>
                        <Field
                          as={Input}
                          id={`experience.${index}.company`}
                          name={`experience.${index}.company`}
                          placeholder="e.g. Google"
                        />
                        <ErrorMessage name={`experience.${index}.company`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`experience.${index}.position`}>Position</Label>
                        <Field
                          as={Input}
                          id={`experience.${index}.position`}
                          name={`experience.${index}.position`}
                          placeholder="e.g. Software Engineer"
                        />
                        <ErrorMessage name={`experience.${index}.position`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`experience.${index}.location`}>Location (Optional)</Label>
                        <Field
                          as={Input}
                          id={`experience.${index}.location`}
                          name={`experience.${index}.location`}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>

                      <div className="space-y-2 col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`experience.${index}.isCurrent`}
                          name={`experience.${index}.isCurrent`}
                          checked={values.experience[index].isCurrent}
                          onChange={handleChange}
                          className="mr-1"
                        />
                        <Label htmlFor={`experience.${index}.isCurrent`}>I currently work here</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                        <Field
                          as={Input}
                          type="date"
                          id={`experience.${index}.startDate`}
                          name={`experience.${index}.startDate`}
                        />
                        <ErrorMessage name={`experience.${index}.startDate`} component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                        <Field
                          as={Input}
                          type="date"
                          id={`experience.${index}.endDate`}
                          name={`experience.${index}.endDate`}
                        />
                        <ErrorMessage name={`experience.${index}.endDate`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor={`experience.${index}.description`}>Description</Label>
                        <Field
                          as={Textarea}
                          id={`experience.${index}.description`}
                          name={`experience.${index}.description`}
                          placeholder="Describe your role, responsibilities, and achievements..."
                          className="min-h-20"
                        />
                        <ErrorMessage name={`experience.${index}.description`} component="div" className="text-red-500 text-sm" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No work experience added yet. Add your first work experience.</p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={() => arrayHelpers.push({
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  description: ''
                })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Work Experience
              </Button>
            </div>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-between px-0 md:px-6">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onTabChange('education')}>
            Previous
          </Button>
          <Button type="button" variant="outline" onClick={() => onTabChange('links')}>
            Next
          </Button>
        </div>
        <Button type="submit" disabled={isSaving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
          {isSaving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperienceTab;
