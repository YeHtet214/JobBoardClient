import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Job } from '../types/job.types';
import jobService from '../services/job.service';

interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  totalPages: number;
  recentlyViewedJobs: Job[];
  // Filter states
  keyword: string;
  location: string;
  jobTypes: string[];
  experienceLevel: string;
  // Methods
  setKeyword: (keyword: string) => void;
  setLocation: (location: string) => void;
  handleJobTypeChange: (type: string) => void;
  setExperienceLevel: (level: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleJobView: (job: Job) => void;
  handlePageChange: (page: number) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  // Filter states
  const [keyword, setKeyword] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);

  // Use React Query to fetch jobs
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', { keyword, location, jobTypes, experienceLevel, page: currentPage }],
    queryFn: async () => {
      try {
        // In a real app, you would pass filters to the API
        const jobs = await jobService.getAllJobs();
        console.log("Fetched Jobs", jobs);
        return jobs || []; // Ensure we always return an array, even if the API returns undefined
      } catch (error) {
        console.error('Error fetching jobs:', error);
        return []; // Return empty array on error instead of letting the error propagate
      }
    }
  });

  // Ensure jobs is always an array
  const jobs = Array.isArray(data) ? data : [];

  // Mock pagination data - in a real app, this would come from the API
  const totalPages = 5;

  // Load recently viewed jobs from localStorage
  React.useEffect(() => {
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
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In a real application with React Query, this would trigger a refetch
    // with the updated filters. React Query will handle this automatically
    // when the query parameters change.
    console.log('Searching with filters:', { keyword, location, jobTypes, experienceLevel });
  }, [keyword, location, jobTypes, experienceLevel]);

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

  const value = {
    jobs,
    isLoading,
    error,
    currentPage,
    totalPages,
    recentlyViewedJobs,
    keyword,
    location,
    jobTypes,
    experienceLevel,
    setKeyword,
    setLocation,
    handleJobTypeChange,
    setExperienceLevel,
    handleSearch,
    handleJobView,
    handlePageChange,
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
