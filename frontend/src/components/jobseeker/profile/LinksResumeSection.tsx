import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface LinksResumeSectionProps {
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}

const LinksResumeSection = ({
  linkedInUrl,
  githubUrl,
  portfolioUrl,
  resumeUrl
}: LinksResumeSectionProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-jobboard-darkblue">Links & Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(linkedInUrl || githubUrl || portfolioUrl) ? (
            <div className="space-y-3">
              {linkedInUrl && (
                <a href={linkedInUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                  <Badge className="bg-[#0077B5] hover:bg-[#0077B5]/90">LinkedIn</Badge>
                  {linkedInUrl}
                </a>
              )}
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                  <Badge className="bg-[#333] hover:bg-[#333]/90">GitHub</Badge>
                  {githubUrl}
                </a>
              )}
              {portfolioUrl && (
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-jobboard-darkblue hover:underline">
                  <Badge className="bg-jobboard-purple hover:bg-jobboard-purple/90">Portfolio</Badge>
                  {portfolioUrl}
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No links added yet</p>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-md font-semibold mb-3 text-gray-900">Resume</h3>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-jobboard-purple rounded-md text-sm font-medium text-jobboard-purple hover:bg-jobboard-purple/10"
              >
                <Award className="h-4 w-4 mr-2" />
                View Resume
              </a>
            ) : (
              <p className="text-gray-500">No resume uploaded yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinksResumeSection;
