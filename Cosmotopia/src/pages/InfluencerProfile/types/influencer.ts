// types/influencer.ts

export interface InfluencerDTO {
  affiliateProfileId: string;
  email?: string;
  phone?: string;
  tagline?: string;
  name: string;
  avatarUrl: string;
  coverImageUrl?: string;
  bio?: string;
  totalVideos: number;
  followersCount: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  createdAt: string;
  isActive: boolean;
}

export interface InfluencerVideoDTO {
  videoId: string;
  affiliateProfileId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
  createdAt: string;
  isActive: boolean;
}

export interface KOLVideoDTO {
  videoId: string;
  affiliateProfileId: string;
  title: string;
  description: string;
  videoUrl: string;
  productId: string;
  createdAt: string;
  isActive: boolean;
}