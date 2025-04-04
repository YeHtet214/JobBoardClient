import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { CreateProfileDto, Profile, UpdateProfileDto } from '@/types/profile.types';
import { useToast } from '@/components/ui/use-toast';

export const PROFILE_QUERY_KEY = 'profile';

export const useProfileQuery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get profile data
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: async () => {
      try {
        return await profileService.getMyProfile();
      } catch (error: any) {
        // If profile doesn't exist yet, return null instead of throwing
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });

  // Create profile
  const createProfileMutation = useMutation({
    mutationFn: (profileData: CreateProfileDto) =>
      profileService.createProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], data);
      toast({
        title: "Success",
        description: "Profile created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating profile:', error);
    }
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileDto) =>
      profileService.updateProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    }
  });

  // Upload resume
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadResume(file),
    onSuccess: (resumeUrl) => {
      // Update the profile with the new resume URL
      queryClient.setQueryData<Profile>([PROFILE_QUERY_KEY], (oldData) => {
        if (!oldData) return null;
        return { ...oldData, resumeUrl };
      });

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
      console.error('Error uploading resume:', error);
    }
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    uploadResume: uploadResumeMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadResumeMutation.isPending,
  };
};
