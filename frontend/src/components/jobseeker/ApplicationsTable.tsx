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
import { X } from 'lucide-react';
import { formatDate, getJobSeekerStatusBadge } from '@/utils/dashboard.utils';
import { JobApplication } from '@/types/dashboard.types';

interface ApplicationsTableProps {
  applications: JobApplication[];
  onWithdrawApplication?: (application: JobApplication) => void;
  emptyStateMessage?: string;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onWithdrawApplication,
  emptyStateMessage = "You haven't applied to any jobs yet."
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{application.jobTitle}</h4>
                  <p className="text-xs text-gray-500 mt-1">{application.companyName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">Applied {formatDate(application.applied)}</span>
                    {getJobSeekerStatusBadge(application.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/jobs/${application.jobId}`)}
                  >
                    View
                  </Button>
                  
                  {onWithdrawApplication && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to withdraw your application for {application.jobTitle} at {application.companyName}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onWithdrawApplication(application)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Withdraw
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

export default ApplicationsTable;
