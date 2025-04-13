import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Bookmark,
} from 'lucide-react';
import { JobApplication, SavedJob, RecentActivity, JobSeekerStats } from '@/types/dashboard.types';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import ApplicationsTable from './ApplicationsTable';
import SavedJobsList from './SavedJobsList';
import { getJobSeekerActivityIcon } from '@/utils/dashboard.utils';

interface JobSeekerDashboardProps {
  stats: JobSeekerStats;
  applications: JobApplication[];
  savedJobs: SavedJob[];
  recentActivity: RecentActivity[];
  onRemoveSavedJob?: (job: SavedJob) => void;
  onWithdrawApplication?: (application: JobApplication) => void;
}

const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({
  stats,
  applications,
  savedJobs,
  recentActivity,
  onRemoveSavedJob,
  onWithdrawApplication
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:!grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="h-6 w-6 text-jobboard-darkblue" />}
          borderColorClass="border-l-jobboard-darkblue"
        />
        
        <DashboardStatCard
          title="Interviews"
          value={stats.interviews}
          icon={<Calendar className="h-6 w-6 text-jobboard-purple" />}
          borderColorClass="border-l-jobboard-purple"
        />
        
        <DashboardStatCard
          title="Offers"
          value={stats.offers}
          icon={<Briefcase className="h-6 w-6 text-jobboard-green" />}
          borderColorClass="border-l-jobboard-green"
        />
        
        <DashboardStatCard
          title="Saved Jobs"
          value={stats.savedJobs}
          icon={<Bookmark className="h-6 w-6 text-jobboard-red" />}
          borderColorClass="border-l-jobboard-red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabs Section */}
        <div>
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applications" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span className="sm:block">Applications</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="sm:block">Saved Jobs</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Your Applications</CardTitle>
                  <CardDescription>
                    Track the status of your job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationsTable 
                    applications={applications} 
                    onWithdrawApplication={onWithdrawApplication}
                  />
                </CardContent>
                {applications.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/applications')}>
                      View All Applications
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>
                    Jobs you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SavedJobsList
                    savedJobs={savedJobs}
                    onRemoveSavedJob={onRemoveSavedJob}
                  />
                </CardContent>
                {savedJobs.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/saved-jobs')}>
                      View All Saved Jobs
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Section */}
        <div>
          <ActivityFeed
            activities={recentActivity}
            title="Recent Activity"
            description="Your latest interactions"
            getActivityIcon={getJobSeekerActivityIcon}
          />

          <div className="mt-6">
            <ProfileCompletionCard
              title="Profile Completion"
              description="Complete your profile to increase visibility"
              completionPercentage={stats.profileCompletion}
              completionItems={[
                { completed: true, text: "Basic information completed" },
                { completed: true, text: "Added 3 skills" },
                { completed: false, text: "Add work experience" },
                { completed: false, text: "Upload resume" }
              ]}
              profilePath="/profile"
              buttonText="Complete Profile"
              isJobSeeker={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
