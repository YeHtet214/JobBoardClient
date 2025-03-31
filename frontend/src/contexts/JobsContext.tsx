import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Job, JobsResponse } from '../types/job.types';
import jobService, { JobSearchParams } from '../services/job.service';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';

// Define sorting options with enum for type safety
export enum SortOption {
  NEWEST = 'date_desc',
  OLDEST = 'date_asc',
  SALARY_HIGH = 'salary_desc',
  SALARY_LOW = 'salary_asc',
  RELEVANCE = 'relevance' // Default - most relevant to search terms
}

interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  recentlyViewedJobs: Job[];
  // Filter states
  keyword: string;
  location: string;
  jobTypes: string[];
  experienceLevel: string;
  // Sort state
  sortBy: SortOption;
  // Methods
  setKeyword: (keyword: string) => void;
  setLocation: (location: string) => void;
  handleJobTypeChange: (type: string) => void;
  setExperienceLevel: (level: string) => void;
  setSortBy: (option: SortOption) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleJobView: (job: Job) => void;
  handlePageChange: (page: number) => void;
  resetFilters: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states - initialize from URL params if available
  const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [jobTypes, setJobTypes] = useState<string[]>(
    searchParams.getAll('jobTypes') || []
  );
  const [experienceLevel, setExperienceLevel] = useState<string>(
    searchParams.get('experienceLevel') || 'ANY'
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get('page') || '1', 10)
  );
  // Get sort option from URL or default to NEWEST
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sortBy') as SortOption) || SortOption.NEWEST
  );
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Debounced versions of the filter states for smoother search experience
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);

  // Limit per page
  const ITEMS_PER_PAGE = 10;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword) params.append('keyword', debouncedKeyword);
    if (debouncedLocation) params.append('location', debouncedLocation);
    if (experienceLevel && experienceLevel !== 'ANY') params.append('experienceLevel', experienceLevel);
    if (currentPage > 1) params.append('page', currentPage.toString());
    if (sortBy !== SortOption.NEWEST) params.append('sortBy', sortBy);

    jobTypes.forEach(type => params.append('jobTypes', type));

    setSearchParams(params, { replace: true });

    // Auto-search when debounced values change
    if ((debouncedKeyword !== searchParams.get('keyword')) || 
        (debouncedLocation !== searchParams.get('location'))) {
      refetch();
    }
  }, [debouncedKeyword, debouncedLocation, jobTypes, experienceLevel, currentPage, sortBy, setSearchParams]);

  // Use React Query to fetch jobs
  const { data, isLoading, error, refetch } = useQuery<JobsResponse>({
    queryKey: ['jobs', { 
      keyword: debouncedKeyword, 
      location: debouncedLocation, 
      jobTypes, 
      experienceLevel, 
      page: currentPage,
      sortBy 
    }],
    queryFn: async () => {
      try {
        const searchParams: JobSearchParams = {
          keyword: debouncedKeyword,
          location: debouncedLocation,
          jobTypes,
          experienceLevel: experienceLevel === 'ANY' ? '' : experienceLevel,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortBy
        };

        const result = await jobService.getAllJobs(searchParams);
        setTotalCount(result.totalCount);
        return result;
      } catch (error) {
        console.error('Error fetching jobs:', error);
        return { jobs: [], totalPages: 0, totalCount: 0, currentPage: 1 }; // Return empty data on error
      }
    }
  });

  // Extract values from the response
  const jobs = data?.jobs || [];
  const totalPages = data?.totalPages || 0;

  // Load recently viewed jobs from localStorage
  useEffect(() => {
    const recentlyViewed = localStorage.getItem('recentlyViewedJobs');
    if (recentlyViewed) {
      try {
        const parsed = JSON.parse(recentlyViewed);
        setRecentlyViewedJobs(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Error parsing recently viewed jobs:', e);
        setRecentlyViewedJobs([]);
      }
    }
  }, []);

  const handleJobTypeChange = useCallback((type: string) => {
    setJobTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
    // Reset to first page when changing filters
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    // Trigger refetch with the updated filters
    refetch();
  }, [refetch]);

  const handleJobView = useCallback((job: Job) => {
    setRecentlyViewedJobs(prev => {
      const updatedRecentlyViewed = [job, ...prev.filter(j => j.id !== job.id)].slice(0, 4);
      localStorage.setItem('recentlyViewedJobs', JSON.stringify(updatedRecentlyViewed));
      return updatedRecentlyViewed;
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // React Query will automatically refetch when the page changes
    window.scrollTo(0, 0);
  }, []);

  const resetFilters = useCallback(() => {
    setKeyword('');
    setLocation('');
    setJobTypes([]);
    setExperienceLevel('ANY');
    setSortBy(SortOption.NEWEST);
    setCurrentPage(1);
  }, []);

  const value = {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    recentlyViewedJobs,
    keyword,
    location,
    jobTypes,
    experienceLevel,
    sortBy,
    setKeyword,
    setLocation,
    handleJobTypeChange,
    setExperienceLevel,
    setSortBy,
    handleSearch,
    handleJobView,
    handlePageChange,
    resetFilters,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobsContext = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobsContext must be used within a JobsProvider');
  }
  return context;
};
