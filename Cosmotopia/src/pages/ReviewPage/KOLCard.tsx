import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export interface KOLCardProps {
  avatar: string;
  name: string;
  reviewCount: number;
  bio: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export const KOLCard: React.FC<KOLCardProps> = ({ avatar, name, reviewCount, bio, socialLinks = {} }) => (
  <div className="flex flex-col p-6 bg-white rounded-2xl shadow-md w-72">
    <div className="flex items-center space-x-4">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />
      <div>
        <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-500">{reviewCount} video reviews</p>
      </div>
    </div>
    <p className="mt-4 text-sm text-gray-700 flex-1">{bio}</p>
    <div className="mt-4 flex space-x-3">
      {socialLinks.facebook && (
        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="w-6 h-6 text-purple-500" />
        </a>
      )}
      {socialLinks.twitter && (
        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="w-6 h-6 text-blue-400" />
        </a>
      )}
      {socialLinks.instagram && (
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram className="w-6 h-6 text-pink-500" />
        </a>
      )}
      {socialLinks.linkedin && (
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="w-6 h-6 text-blue-700" />
        </a>
      )}
    </div>
  </div>
);