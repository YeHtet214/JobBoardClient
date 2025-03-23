import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Job } from '../types/job.types';
import jobService from '../services/job.service';

interface UseJobsDataReturn {
  jobs: Job[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  totalPages: number;
  recentlyViewedJobs: Job[];
  keyword: string;
  location: string;
  jobTypes: string[];
  experienceLevel: string;
  setKeyword: (keyword: string) => void;
  setLocation: (location: string) => void;
  handleJobTypeChange: (type: string) => void;
  setExperienceLevel: (level: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleJobView: (job: Job) => void;
  handlePageChange: (page: number) => void;
}

export const useJobsData = (): UseJobsDataReturn => {
  // Filter states
  const [keyword, setKeyword] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<Job[]>([]);

  // Use React Query to fetch jobs
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['jobs', { keyword, location, jobTypes, experienceLevel, page: currentPage }],
    queryFn: async () => {
      // In a real app, you would pass filters to the API
      return await jobService.getAllJobs();
    }
  });

  const jobs = data as Job[];

  // Mock pagination data - in a real app, this would come from the API
  const totalPages = 5;

  // Load recently viewed jobs from localStorage
  useEffect(() => {
    const recentlyViewed = localStorage.getItem('recentlyViewedJobs');
    if (recentlyViewed) {
      setRecentlyViewedJobs(JSON.parse(recentlyViewed));
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

  return {
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
};
