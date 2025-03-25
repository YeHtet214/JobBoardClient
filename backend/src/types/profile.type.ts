export interface CreateProfileDto {
  userId: string;
  bio?: string;
  address?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  socialLinks?: Record<string, string>;
  resumeUrl?: string;
}

export interface UpdateProfileDto {
  bio?: string;
  address?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  socialLinks?: Record<string, string>;
  resumeUrl?: string;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  bio?: string;
  address?: string;
  education?: string;
  experience?: string;
  skills: string[];
  socialLinks?: Record<string, string>;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}
