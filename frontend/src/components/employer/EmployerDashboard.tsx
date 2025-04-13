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
  Plus,
  UserCheck
} from 'lucide-react';
import { PostedJob, ReceivedApplication, EmployerActivity, EmployerStats } from '@/types/dashboard.types';
import DashboardStatCard from '../dashboard/DashboardStatCard';
import ActivityFeed from '../dashboard/ActivityFeed';
import ProfileCompletionCard from '../dashboard/ProfileCompletionCard';
import PostedJobsList from './PostedJobsList';
import ReceivedApplicationsList from './ReceivedApplicationsList';
import { getEmployerActivityIcon } from '@/utils/dashboard.utils';

interface EmployerDashboardProps {
  stats: EmployerStats;
  postedJobs: PostedJob[];
  applications: ReceivedApplication[];
  recentActivity: EmployerActivity[];
  companyProfileComplete: boolean;
  companyProfilePercentage: number;
  onUpdateApplicationStatus?: (application: ReceivedApplication, status: ReceivedApplication['status']) => void;
  onDeleteJob?: (job: PostedJob) => void;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  stats,
  postedJobs,
  applications,
  recentActivity,
  companyProfileComplete,
  companyProfilePercentage,
  onUpdateApplicationStatus,
  onDeleteJob
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:!grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={<Briefcase className="h-6 w-6 text-jobboard-darkblue" />}
          borderColorClass="border-l-jobboard-darkblue"
        />
        
        <DashboardStatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FileText className="h-6 w-6 text-jobboard-purple" />}
          borderColorClass="border-l-jobboard-purple"
        />
        
        <DashboardStatCard
          title="Interview Invitations"
          value={stats.interviewInvitations}
          icon={<UserCheck className="h-6 w-6 text-jobboard-green" />}
          borderColorClass="border-l-jobboard-green"
        />
        
        <DashboardStatCard
          title="Reviewing"
          value={stats.reviewingApplications}
          icon={<Plus className="h-6 w-6 text-jobboard-red" />}
          borderColorClass="border-l-jobboard-red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabs Section */}
        <div>
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobs" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="sm:block">Posted Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span className="sm:block">Applications</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Job Postings</CardTitle>
                      <CardDescription>
                        Manage your active and past job postings
                      </CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-jobboard-darkblue hover:bg-jobboard-darkblue/90"
                      onClick={() => navigate('/employer/jobs/create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Job
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PostedJobsList
                    postedJobs={postedJobs}
                    onDeleteJob={onDeleteJob}
                  />
                </CardContent>
                {postedJobs.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/jobs')}>
                      View All Jobs
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Received Applications</CardTitle>
                  <CardDescription>
                    Applications received for your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReceivedApplicationsList
                    applications={applications}
                    onUpdateApplicationStatus={onUpdateApplicationStatus}
                  />
                </CardContent>
                {applications.length > 0 && (
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/employer/applications')}>
                      View All Applications
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
            description="Recent activity on your job postings"
            getActivityIcon={getEmployerActivityIcon}
          />

          <div className="mt-6">
            <ProfileCompletionCard
              title="Company Profile"
              description={companyProfileComplete 
                ? "Your company profile looks great!" 
                : "Complete your company profile to attract more applicants"}
              completionPercentage={companyProfilePercentage}
              completionItems={[
                { completed: true, text: "Basic company information added" },
                { completed: true, text: "Company location set" },
                { completed: companyProfileComplete, text: "Add company logo" },
                { completed: companyProfileComplete, text: "Complete company description" }
              ]}
              profilePath="/company/profile"
              buttonText={companyProfileComplete ? "Update Company Profile" : "Complete Company Profile"}
              isJobSeeker={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
