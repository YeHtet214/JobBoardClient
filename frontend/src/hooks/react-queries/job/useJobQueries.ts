import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CreateJobDto, UpdateJobDto } from '@/types/job.types';
import jobService from '@/services/job.service';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: CreateJobDto) => jobService.createJob(jobData),
    onSuccess: () => {
      // Invalidate company jobs cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
    },
  });
};

export const useCompanyJobs = () => {
  return useSuspenseQuery({
    queryKey: ['companyJobs'],
    queryFn: async () => jobService.getCompanyJobs()
  });
};

export const useJobDetail = (jobId: string) => {
  return useSuspenseQuery({
    queryKey: ['job', jobId],
    queryFn: async () => jobService.getJobById(jobId),
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, jobData }: { id: string; jobData: UpdateJobDto }) => jobService.updateJob(id, jobData),
    onSuccess: (_, variables) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      // Invalidate company jobs cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
    },
  });
};
