
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Briefcase, Award, User, MapPin, Calendar, Building2 } from 'lucide-react';

interface ProfileSectionProps {
  profile: {
    name: string;
    image?: string;
    location?: string;
    degree?: string;
    university?: string;
    graduationYear?: string;
    experience?: {
      title: string;
      company: string;
      duration: string;
      description: string;
    }[];
    skills?: string[];
    achievements?: string[];
    about?: string;
  };
  type: 'employee' | 'recruiter';
}

const ProfileSection = ({ profile, type }: ProfileSectionProps) => {
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      {/* Header */}
      <Card className="overflow-hidden animate-fade-in">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40"></div>
        <CardContent className="p-6 pt-0 -mt-16">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="flex-shrink-0 rounded-full border-4 border-white shadow-lg overflow-hidden h-32 w-32 bg-white">
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User size={48} className="text-primary" />
                </div>
              )}
            </div>
            
            <div className="space-y-1 flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.degree && (
                <div className="flex items-center text-muted-foreground">
                  <GraduationCap size={16} className="mr-1" />
                  <span>{profile.degree}</span>
                  {profile.university && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{profile.university}</span>
                    </>
                  )}
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* About */}
      {profile.about && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{profile.about}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Briefcase size={18} className="mr-2" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className={index !== 0 ? "pt-4 border-t" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Building2 size={14} className="mr-1" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{exp.duration}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Education */}
      {(profile.degree || profile.university) && (
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <GraduationCap size={18} className="mr-2" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{profile.degree}</h3>
                <div className="flex items-center text-muted-foreground">
                  <Building2 size={14} className="mr-1" />
                  <span>{profile.university}</span>
                </div>
              </div>
              {profile.graduationYear && (
                <Badge variant="outline" className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {profile.graduationYear}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Skills & Achievements */}
      {(profile.skills || profile.achievements) && (
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          {profile.skills && profile.skills.length > 0 && (
            <>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Award size={18} className="mr-2" />
                  Skills & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.skills && (
                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.achievements && profile.achievements.length > 0 && (
                  <div className="pt-2">
                    <h3 className="font-semibold mb-2">Achievements</h3>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      {profile.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProfileSection;
