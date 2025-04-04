import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { FileText, Github, Linkedin, Globe, Upload, AlertCircle } from 'lucide-react';
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

interface LinksTabProps {
  formik: FormikProps<Profile>;
  isSaving: boolean;
  onTabChange: (tab: string) => void;
  onResumeUpload: (file: File) => Promise<void>;
  isResumeUploading: boolean;
}

const LinksTab = ({ 
  formik, 
  isSaving, 
  onTabChange, 
  onResumeUpload, 
  isResumeUploading 
}: LinksTabProps) => {
  const { values } = formik;
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setResumeUploadError('File size exceeds the 5MB limit');
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setResumeUploadError('Only PDF, DOC, and DOCX files are allowed');
        return;
      }

      setResumeFile(file);
      setResumeUploadError(null);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeUploadError('Please select a file to upload');
      return;
    }

    try {
      await onResumeUpload(resumeFile);
      setResumeFile(null);
    } catch (error) {
      console.error('Error in resume upload handler:', error);
      setResumeUploadError('Failed to upload resume. Please try again.');
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 md:px-6">
        <CardTitle className="text-xl md:text-2xl text-jobboard-darkblue">Links & Resume</CardTitle>
        <CardDescription className="text-gray-500">
          Add your professional links and upload your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0 md:px-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Linkedin className="h-5 w-5 text-jobboard-purple" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn Profile</Label>
              <Field
                as={Input}
                id="linkedInUrl"
                name="linkedInUrl"
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <ErrorMessage name="linkedInUrl" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Github className="h-5 w-5 text-jobboard-purple" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="githubUrl">GitHub Profile</Label>
              <Field
                as={Input}
                id="githubUrl"
                name="githubUrl"
                placeholder="https://github.com/yourusername"
              />
              <ErrorMessage name="githubUrl" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Globe className="h-5 w-5 text-jobboard-purple" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio Website</Label>
              <Field
                as={Input}
                id="portfolioUrl"
                name="portfolioUrl"
                placeholder="https://yourportfolio.com"
              />
              <ErrorMessage name="portfolioUrl" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <Label className="text-base font-semibold">Resume</Label>

            {values && values.resumeUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-md bg-gray-50 gap-3">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-jobboard-purple mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium block">Current Resume</span>
                    <span className="text-xs text-gray-500 truncate block">
                      {values.resumeUrl.split('/').pop()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(values.resumeUrl, '_blank')}
                    className="w-full sm:w-auto"
                  >
                    View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-md bg-gray-50 text-center">
                <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No resume uploaded yet.</p>
                <p className="text-xs text-gray-500 mt-1">Upload your resume to increase your chances of getting hired.</p>
              </div>
            )}

            <div className="space-y-2 mt-4">
              <Label htmlFor="resume" className="text-sm font-medium">Upload New Resume</Label>
              <div className="flex flex-col gap-3">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileChange}
                  className="cursor-pointer"
                />

                {resumeUploadError && (
                  <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {resumeUploadError}
                  </div>
                )}

                <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</p>

                {resumeFile && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-gray-100 rounded-md">
                    <div className="flex items-center flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-jobboard-purple mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{resumeFile.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={isResumeUploading || !resumeFile}
                  className={`mt-2 w-full sm:w-auto ${!resumeFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isResumeUploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-0 md:px-6">
        <Button type="button" variant="outline" onClick={() => onTabChange('experience')}>
          Previous
        </Button>
        <Button type="submit" disabled={isSaving} className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90">
          {isSaving ? <LoadingSpinner size="sm" /> : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LinksTab;
