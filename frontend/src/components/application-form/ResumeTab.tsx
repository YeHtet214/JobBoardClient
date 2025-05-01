import React, { useRef } from 'react';
import { FormikProps } from 'formik';
import { ApplicationFormValues } from '@/types/application.types';
// import { 
//   FormControl, 
//   FormItem, 
//   FormLabel, 
//   FormMessage 
// } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Upload } from 'lucide-react';

interface ResumeTabProps {
  formik: FormikProps<ApplicationFormValues>;
}

const ResumeTab: React.FC<ResumeTabProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, setFieldValue } = formik;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    setFieldValue('resume', file);
  };

  const handleUseExistingResumeChange = () => {
    setFieldValue('useExistingResume', !values.useExistingResume);
    if (!values.useExistingResume) {
      setFieldValue('resume', null);
    }
  };

  return (
    // <div className="space-y-4">
    //   <h3 className="text-lg font-medium">Resume / CV</h3>
    //   <p className="text-sm text-gray-500">
    //     Upload your resume or use one from your profile.
    //   </p>

    //   <div className="grid gap-6 py-4">
    //     {/* Option to use existing resume */}
    //     <div className="flex items-center space-x-2">
    //       <Checkbox
    //         id="useExistingResume"
    //         name="useExistingResume"
    //         checked={values.useExistingResume}
    //         onCheckedChange={handleUseExistingResumeChange}
    //       />
    //       <Label htmlFor="useExistingResume">
    //         Use resume from my profile
    //       </Label>
    //     </div>

    //     {/* Resume upload section - shown if not using existing resume */}
    //     {!values.useExistingResume && (
    //       <div className="grid gap-2">
    //         <FormItem className={`${touched.resume && errors.resume ? 'error' : ''}`}>
    //           <FormLabel htmlFor="resume">Upload Resume</FormLabel>
    //           <FormControl>
    //             <div className="mt-2">
    //               <input
    //                 id="resume"
    //                 name="resume"
    //                 type="file"
    //                 ref={fileInputRef}
    //                 onChange={handleFileChange}
    //                 className="hidden"
    //                 accept=".pdf,.doc,.docx"
    //               />
                  
    //               <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
    //                 {values.resume ? (
    //                   <div className="flex flex-col items-center">
    //                     <FileText className="h-10 w-10 text-primary mb-2" />
    //                     <p className="text-sm font-medium text-primary">{values.resume.name}</p>
    //                     <p className="text-xs text-gray-500 mb-2">
    //                       {(values.resume.size / 1024 / 1024).toFixed(2)} MB
    //                     </p>
    //                     <Button 
    //                       type="button" 
    //                       variant="outline" 
    //                       size="sm"
    //                       onClick={() => setFieldValue('resume', null)}
    //                     >
    //                       Remove
    //                     </Button>
    //                   </div>
    //                 ) : (
    //                   <div className="flex flex-col items-center">
    //                     <Upload className="h-10 w-10 text-gray-400 mb-2" />
    //                     <p className="text-sm text-gray-500 mb-2">
    //                       Drag and drop your resume, or click to browse
    //                     </p>
    //                     <Button 
    //                       type="button" 
    //                       variant="outline"
    //                       onClick={() => fileInputRef.current?.click()}
    //                     >
    //                       Select File
    //                     </Button>
    //                     <p className="text-xs text-gray-400 mt-2">
    //                       Supported formats: PDF, DOC, DOCX
    //                     </p>
    //                   </div>
    //                 )}
    //               </div>
    //             </div>
    //           </FormControl>
    //           {touched.resume && errors.resume && !values.useExistingResume && (
    //             <FormMessage className="text-red-500 text-xs mt-1">
    //               {errors.resume as string}
    //             </FormMessage>
    //           )}
    //         </FormItem>
    //       </div>
    //     )}

    //     {/* Show preview of existing resume if selected */}
    //     {values.useExistingResume && (
    //       <div className="bg-gray-50 p-4 rounded-lg">
    //         <div className="flex items-center">
    //           <FileText className="h-8 w-8 text-primary mr-2" />
    //           <div>
    //             <p className="text-sm font-medium">Your existing resume</p>
    //             <p className="text-xs text-gray-500">Last updated: May 1, 2023</p>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div>Resume tab</div>
  );
};

export default ResumeTab;
