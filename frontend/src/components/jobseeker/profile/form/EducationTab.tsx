import { Field, FieldArray, ErrorMessage } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, GraduationCap } from 'lucide-react';
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

interface EducationTabProps {
  formik: FormikProps<Profile>;
  isSaving: boolean;
  onTabChange: (tab: string) => void;
}

const EducationTab = ({ formik, isSaving, onTabChange }: EducationTabProps) => {
  const { values, handleChange } = formik;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Education</CardTitle>
        <CardDescription className="text-gray-500">
          Add your educational background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <FieldArray
          name="education"
          render={arrayHelpers => (
            <div className="space-y-8">
              {values?.education && values.education.length > 0 ? (
                values.education.map((_, index) => (
                  <div key={index} className="relative p-4 sm:p-6 border rounded-lg">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center mb-4">
                      <GraduationCap className="mr-2 h-6 w-6 text-jobboard-purple" />
                      <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`education.${index}.institution`}>Institution</Label>
                        <Field
                          as={Input}
                          id={`education.${index}.institution`}
                          name={`education.${index}.institution`}
                          placeholder="e.g. Harvard University"
                        />
                        <ErrorMessage name={`education.${index}.institution`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`education.${index}.degree`}>Degree</Label>
                        <Field
                          as={Input}
                          id={`education.${index}.degree`}
                          name={`education.${index}.degree`}
                          placeholder="e.g. Bachelor of Science"
                        />
                        <ErrorMessage name={`education.${index}.degree`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`education.${index}.fieldOfStudy`}>Field of Study</Label>
                        <Field
                          as={Input}
                          id={`education.${index}.fieldOfStudy`}
                          name={`education.${index}.fieldOfStudy`}
                          placeholder="e.g. Computer Science"
                        />
                        <ErrorMessage name={`education.${index}.fieldOfStudy`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2 col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`education.${index}.isCurrent`}
                          name={`education.${index}.isCurrent`}
                          checked={values.education[index].isCurrent}
                          onChange={handleChange}
                          className="mr-1"
                        />
                        <Label htmlFor={`education.${index}.isCurrent`}>I currently study here</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
                        <Field
                          as={Input}
                          type="date"
                          id={`education.${index}.startDate`}
                          name={`education.${index}.startDate`}
                        />
                        <ErrorMessage name={`education.${index}.startDate`} component="div" className="text-red-500 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                        <Field
                          as={Input}
                          type="date"
                          id={`education.${index}.endDate`}
                          name={`education.${index}.endDate`}
                        />
                        <ErrorMessage name={`education.${index}.endDate`} component="div" className="text-red-500 text-sm" />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor={`education.${index}.description`}>Description (Optional)</Label>
                        <Field
                          as={Textarea}
                          id={`education.${index}.description`}
                          name={`education.${index}.description`}
                          placeholder="Add more details about your education..."
                          className="min-h-20"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No education added yet. Add your first education entry.</p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={() => arrayHelpers.push({
                  institution: '',
                  degree: '',
                  fieldOfStudy: '',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  description: ''
                })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </div>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-between px-0 md:px-6">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onTabChange('info')}>
            Previous
          </Button>
          <Button type="button" variant="outline" onClick={() => onTabChange('experience')}>
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

export default EducationTab;
