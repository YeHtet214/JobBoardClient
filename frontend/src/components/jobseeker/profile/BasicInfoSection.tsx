import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Profile } from '@/types/profile.types';
import { User } from '@/types/user.types';

interface BasicInfoSectionProps {
  profile: Profile;
  currentUser: User | null;
}

const BasicInfoSection = ({ profile, currentUser }: BasicInfoSectionProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-jobboard-purple text-white text-2xl">
              {currentUser?.firstName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-jobboard-darkblue">
              {currentUser?.firstName || 'Job Seeker'}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              {currentUser?.email || ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-jobboard-darkblue">Bio</h3>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-jobboard-darkblue">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, i) => (
                <Badge key={i} className="bg-jobboard-purple/20 text-jobboard-darkblue hover:bg-jobboard-purple/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
