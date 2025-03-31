import React from 'react';
import Sidebar from '../layouts/Sidebar';
import { useJobsContext } from '../../contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const JobFilters: React.FC = () => {
  const {
    keyword,
    setKeyword,
    location,
    setLocation,
    jobTypes,
    handleJobTypeChange,
    experienceLevel,
    setExperienceLevel,
    handleSearch,
    resetFilters
  } = useJobsContext();

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'REMOTE', label: 'Remote' }
  ];

  const experienceLevelOptions = [
    { value: 'ANY', label: 'Any Experience' },
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior Level' },
    { value: 'EXECUTIVE', label: 'Executive' }
  ];

  return (
    <Sidebar title="Filter Jobs">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="keyword" className="text-sm font-medium text-gray-700">
              Keyword
            </Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title or keyword"
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote"
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Job Type
            </Label>
            <div className="space-y-2">
              {jobTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${option.value}`}
                    checked={jobTypes.includes(option.value)}
                    onCheckedChange={() => handleJobTypeChange(option.value)}
                  />
                  <Label
                    htmlFor={`job-type-${option.value}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-1 block">
              Experience Level
            </Label>
            <Select
              value={experienceLevel || "ANY"}
              onValueChange={setExperienceLevel}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full bg-jobboard-purple hover:bg-jobboard-purple/90 text-white"
          >
            Apply Filters
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </form>
    </Sidebar>
  );
};

export default JobFilters;
