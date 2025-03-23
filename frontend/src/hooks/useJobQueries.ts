import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService from '../services/job.service';
import type { Job, CreateJobDto, UpdateJobDto } from '../types/job.types';

// Query keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...jobKeys.lists(), { filters }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  company: (companyId: string) => [...jobKeys.all, 'company', companyId] as const,
};

// Queries
export const useJobs = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: jobKeys.list(filters || {}),
    queryFn: async () => {
      // In a real app, you would pass filters to the API
      try {
        const jobs = await jobService.getAllJobs();
        return jobs || [];
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return [];
      }
    },
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: async () => {
      try {
        const job = await jobService.getJobById(id);
        return job || null;
      } catch (error) {
        console.log('Error fetching job with id: ', id);
        return null;
      }
    },
    enabled: !!id, // Only run the query if we have an ID
  });
};

export const useCompanyJobs = (companyId: string) => {
  return useQuery({
    queryKey: jobKeys.company(companyId),
    queryFn: async () => {
      return await jobService.getJobsByCompany(companyId);
    },
    enabled: !!companyId, // Only run the query if we have a company ID
  });
};

// Mutations
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newJob: CreateJobDto) => {
      return jobService.createJob(newJob);
    },
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, job }: { id: string; job: UpdateJobDto }) => {
      return jobService.updateJob(id, job);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the specific job and the jobs list
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      return jobService.deleteJob(id);
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch the jobs list
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      // Remove the job from the cache
      queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
    },
  });
};
