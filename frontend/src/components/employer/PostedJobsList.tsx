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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { formatDate, getJobStatusBadge } from '@/utils/dashboard.utils';
import { PostedJob } from '@/types/dashboard.types';

interface PostedJobsListProps {
  postedJobs: PostedJob[];
  onDeleteJob?: (job: PostedJob) => void;
  emptyStateMessage?: string;
}

const PostedJobsList: React.FC<PostedJobsListProps> = ({
  postedJobs,
  onDeleteJob,
  emptyStateMessage = "You haven't posted any jobs yet."
}) => {
  const navigate = useNavigate(); 

  console.log("Posted jobs: ", postedJobs);

  return (
    <div>
      {postedJobs?.length > 0 ? (
        <div className="space-y-4">
          {postedJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{job.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">Posted {formatDate(job.postedDate)}</span>
                    {getJobStatusBadge(job.status)}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-medium">{job.applicationsCount}</span> applications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View
                  </Button>

                  {onDeleteJob && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}/applications`)}>
                          View Applications
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                              Delete Job
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the job posting for {job.title}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteJob(job)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">{emptyStateMessage}</p>
          <Button
            onClick={() => navigate('/employer/jobs/create')}
            className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
          >
            Post a Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostedJobsList;
