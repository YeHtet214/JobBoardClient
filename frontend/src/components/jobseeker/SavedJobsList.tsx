import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/dashboard.utils';
import { SavedJob } from '@/types/dashboard.types';

interface SavedJobsListProps {
  savedJobs: SavedJob[];
  onRemoveSavedJob?: (job: SavedJob) => void;
  emptyStateMessage?: string;
}

const SavedJobsList: React.FC<SavedJobsListProps> = ({
  savedJobs,
  onRemoveSavedJob,
  emptyStateMessage = "You haven't saved any jobs yet."
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{job.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{job.companyName}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500">Saved {formatDate(job.savedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/jobs/${job.jobId}`)}
                  >
                    View
                  </Button>
                  
                  {onRemoveSavedJob && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Saved Job</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {job.title} at {job.companyName} from your saved jobs?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onRemoveSavedJob(job)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">{emptyStateMessage}</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </div>
      )}
    </div>
  );
};

export default SavedJobsList;
