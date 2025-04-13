import { useCallback } from 'react';
import { useAuth } from '@/contexts/authContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import JobSeekerDashboard from '@/components/jobseeker/JobSeekerDashboard';
import EmployerDashboard from '@/components/employer/EmployerDashboard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { 
  useJobSeekerDashboard, 
  useEmployerDashboard,
  useRemoveSavedJob,
  useWithdrawApplication,
  useUpdateApplicationStatus,
  useDeletePostedJob
} from '@/hooks/react-queries/dashboard';
import { 
  JobApplication, 
  SavedJob, 
  PostedJob, 
  ReceivedApplication,
  UpdateApplicationStatusDto
} from '@/types/dashboard.types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Job seeker query and mutations
  const { 
    data: jobseekerData,
    isLoading: isJobseekerLoading,
    error: jobseekerError,
    refetch: refetchJobseekerData
  } = useJobSeekerDashboard();
  
  const { mutate: removeSavedJob } = useRemoveSavedJob();
  const { mutate: withdrawApplication } = useWithdrawApplication();
  
  // Employer query and mutations
  const { 
    data: employerData,
    isLoading: isEmployerLoading,
    error: employerError,
    refetch: refetchEmployerData
  } = useEmployerDashboard();
  
  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus();
  const { mutate: deletePostedJob } = useDeletePostedJob();

  // Determine if loading based on user role
  const isLoading = currentUser?.role === 'JOBSEEKER' 
    ? isJobseekerLoading 
    : currentUser?.role === 'EMPLOYER' 
      ? isEmployerLoading 
      : false;
  
  // Handle job seeker actions
  const handleRemoveSavedJob = useCallback((job: SavedJob) => {
    removeSavedJob(job.id, {
      onSuccess: () => {
        toast({
          title: "Job removed",
          description: `${job.title} has been removed from your saved jobs.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove job. Please try again.",
          variant: "destructive"
        });
      }
    });
  }, [removeSavedJob]);

  const handleWithdrawApplication = useCallback((application: JobApplication) => {
    withdrawApplication(application.id, {
      onSuccess: () => {
        toast({
          title: "Application withdrawn",
          description: `Your application for ${application.jobTitle} has been withdrawn.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to withdraw application. Please try again.",
          variant: "destructive"
        });
      }
    });
  }, [withdrawApplication]);

  // Handle employer actions
  const handleUpdateApplicationStatus = useCallback((
    application: ReceivedApplication, 
    status: ReceivedApplication['status']
  ) => {
    const statusData: UpdateApplicationStatusDto = { status };
    updateApplicationStatus(
      { id: application.id, statusData },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Application status updated to ${status.toLowerCase()}.`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update application status. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  }, [updateApplicationStatus]);

  const handleDeleteJob = useCallback((job: PostedJob) => {
    deletePostedJob(job.id, {
      onSuccess: () => {
        toast({
          title: "Job deleted",
          description: `${job.title} has been deleted.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive"
        });
      }
    });
  }, [deletePostedJob]);

  const handleRefresh = useCallback(() => {
    if (currentUser?.role === 'JOBSEEKER') {
      refetchJobseekerData();
    } else if (currentUser?.role === 'EMPLOYER') {
      refetchEmployerData();
    }
  }, [currentUser, refetchJobseekerData, refetchEmployerData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error states
  if (
    (currentUser?.role === 'JOBSEEKER' && jobseekerError) || 
    (currentUser?.role === 'EMPLOYER' && employerError)
  ) {
    return (
      <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">Dashboard</h1>
        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error loading dashboard</h2>
          <p className="text-red-600 mb-4">
            There was an error loading your dashboard data. Please try refreshing the page.
          </p>
          <p className="text-sm text-red-500">
            {currentUser?.role === 'JOBSEEKER' 
              ? (jobseekerError as Error)?.message 
              : (employerError as Error)?.message}
          </p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  // If the user doesn't have a valid role
  if (
    !currentUser || 
    (currentUser.role !== 'JOBSEEKER' && currentUser.role !== 'EMPLOYER')
  ) {
    return (
      <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">Dashboard</h1>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Account setup required</h2>
          <p className="text-yellow-600">
            Please complete your account setup to access the dashboard features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">Dashboard</h1>

      {currentUser?.role === 'JOBSEEKER' && jobseekerData ? (
        <JobSeekerDashboard 
          stats={jobseekerData.stats}
          applications={jobseekerData.applications}
          savedJobs={jobseekerData.savedJobs}
          recentActivity={jobseekerData.recentActivity}
          onRemoveSavedJob={handleRemoveSavedJob}
          onWithdrawApplication={handleWithdrawApplication}
        />
      ) : currentUser?.role === 'EMPLOYER' && employerData ? (
        <EmployerDashboard 
          stats={employerData.stats}
          postedJobs={employerData.postedJobs}
          applications={employerData.applications}
          recentActivity={employerData.recentActivity}
          companyProfileComplete={employerData.companyProfileComplete}
          companyProfilePercentage={employerData.companyProfilePercentage}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onDeleteJob={handleDeleteJob}
        />
      ) : (
        <DashboardSkeleton />
      )}
    </div>
  );
};

export default DashboardPage;
