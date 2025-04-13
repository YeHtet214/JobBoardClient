import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService, { JobSearchParams } from '@/services/job.service';
import type { CreateJobDto, UpdateJobDto, JobsResponse } from '@/types/job.types';
import { SortOption } from '@/contexts/JobsContext';

// Query keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...jobKeys.lists(), { filters }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  company: (companyId: string) => [...jobKeys.all, 'company', companyId] as const,
  search: (filters: Record<string, any>) => [...jobKeys.all, 'search', { filters }] as const,
};

interface JobsSearchParams {
  keyword?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevel?: string;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
  [key: string]: any; // Allow additional filter parameters
}

/** 
 * Hook for fetching jobs with flexible filtering options
 * 
 * @param filters - Search parameters for jobs
 * @param isSearch - Whether this is a search query
 * @returns Query result with jobs data
 */
export const useJobs = (filters: JobsSearchParams = {}, isSearch = false) => {
  const queryKey = isSearch 
    ? jobKeys.search(filters)
    : jobKeys.list(filters);
    
  return useQuery<JobsResponse>({
    queryKey,
    queryFn: async () => {
      try {
        // Create proper search params object
        const searchParams: JobSearchParams = {
          ...(filters.keyword !== undefined && { keyword: filters.keyword }),
          ...(filters.location !== undefined && { location: filters.location }),
          ...(filters.jobTypes?.length && { jobTypes: filters.jobTypes }),
          ...(filters.experienceLevel && { 
            experienceLevel: filters.experienceLevel === 'ANY' ? '' : filters.experienceLevel 
          }),
          ...(filters.page !== undefined && { page: filters.page }),
          ...(filters.limit !== undefined && { limit: filters.limit }),
          ...(filters.sortBy !== undefined && { sortBy: filters.sortBy }),
        };

        const result = await jobService.getAllJobs(searchParams);
        return result;
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return { jobs: [], totalPages: 0, totalCount: 0, currentPage: 1 }; // Return empty data on error
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
