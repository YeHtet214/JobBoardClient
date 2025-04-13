import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dashboardService from '@/services/dashboard.service';
import { 
  UpdateApplicationStatusDto,
  ReceivedApplication
} from '@/types/dashboard.types';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  jobseeker: ['dashboard', 'jobseeker'] as const,
  employer: ['dashboard', 'employer'] as const,
  applications: ['dashboard', 'applications'] as const,
  savedJobs: ['dashboard', 'savedJobs'] as const,
  postedJobs: ['dashboard', 'postedJobs'] as const,
  receivedApplications: ['dashboard', 'receivedApplications'] as const,
  application: (id: string) => ['dashboard', 'application', id] as const,
  companyProfile: ['dashboard', 'companyProfile'] as const,
};

// Job seeker dashboard queries
export const useJobSeekerDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.jobseeker,
    queryFn: async () => {
      try {
        return await dashboardService.getJobSeekerDashboardData();
      } catch (error) {
        console.error('Error fetching job seeker dashboard data:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRemoveSavedJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dashboardService.removeSavedJob(id),
    onSuccess: () => {
      // Invalidate job seeker dashboard and saved jobs queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.jobseeker });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.savedJobs });
    }
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dashboardService.withdrawApplication(id),
    onSuccess: () => {
      // Invalidate job seeker dashboard and applications queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.jobseeker });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.applications });
    }
  });
};

// Employer dashboard queries
export const useEmployerDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.employer,
    queryFn: async () => {
      try {
        return await dashboardService.getEmployerDashboardData();
      } catch (error) {
        console.error('Error fetching employer dashboard data:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, statusData }: { id: string; statusData: UpdateApplicationStatusDto }) => 
      dashboardService.updateApplicationStatus(id, statusData),
    onSuccess: (updatedApplication: ReceivedApplication) => {
      // Invalidate employer dashboard and specific application
      queryClient.invalidateQueries({ queryKey: dashboardKeys.employer });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.receivedApplications });
      queryClient.invalidateQueries({ 
        queryKey: dashboardKeys.application(updatedApplication.id) 
      });
    }
  });
};

export const useDeletePostedJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dashboardService.deletePostedJob(id),
    onSuccess: () => {
      // Invalidate employer dashboard and posted jobs queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.employer });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.postedJobs });
    }
  });
};

export const useCompanyProfileCompletion = () => {
  return useQuery({
    queryKey: dashboardKeys.companyProfile,
    queryFn: async () => {
      try {
        return await dashboardService.getCompanyProfileCompletion();
      } catch (error) {
        console.error('Error fetching company profile completion:', error);
        return { complete: false, percentage: 0 };
      }
    }
  });
};
