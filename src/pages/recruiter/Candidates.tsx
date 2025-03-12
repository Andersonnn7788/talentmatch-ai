
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CandidateCard from '@/components/CandidateCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ArrowUpDown, Search, X } from 'lucide-react';

// Sample candidate data for demo
const allCandidates = [
  {
    id: '1',
    name: 'Sarah Chen',
    matchScore: 95,
    university: 'MIT',
    degree: 'M.S. Computer Science',
    experience: ['Senior Developer at TechX', '5 years experience'],
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Machine Learning'],
    status: 'new' as const,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    matchScore: 88,
    university: 'Stanford',
    degree: 'B.S. Data Science',
    experience: ['Data Analyst at DataWorks', '3 years experience'],
    skills: ['SQL', 'Python', 'Tableau', 'R', 'Statistics'],
    status: 'new' as const,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    matchScore: 82,
    university: 'UCLA',
    degree: 'B.A. Graphic Design',
    experience: ['UI Designer at DesignHub', '4 years experience'],
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI/UX', 'Prototyping'],
    status: 'reviewed' as const,
  },
  {
    id: '4',
    name: 'James Wilson',
    matchScore: 79,
    university: 'Georgia Tech',
    degree: 'B.S. Computer Engineering',
    experience: ['Software Engineer at TechStart', '2 years experience'],
    skills: ['JavaScript', 'React', 'C++', 'Algorithms'],
    status: 'new' as const,
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    matchScore: 75,
    university: 'UC Berkeley',
    degree: 'M.B.A.',
    experience: ['Product Manager at ProductCo', '6 years experience'],
    skills: ['Product Strategy', 'Agile', 'User Research', 'Go-to-market'],
    status: 'reviewed' as const,
  },
  {
    id: '6',
    name: 'David Kim',
    matchScore: 72,
    university: 'Harvard',
    degree: 'B.S. Economics',
    experience: ['Marketing Specialist at GrowthCo', '3 years experience'],
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    status: 'new' as const,
  },
];

const Candidates = () => {
  const [candidates, setCandidates] = useState(allCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'name'>('match');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      applySorting(applyStatusFilter(allCandidates));
    } else {
      const filtered = allCandidates.filter(candidate => 
        candidate.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(e.target.value.toLowerCase())) ||
        candidate.degree.toLowerCase().includes(e.target.value.toLowerCase())
      );
      applySorting(applyStatusFilter(filtered));
    }
  };
  
  const applyStatusFilter = (candidateList: typeof allCandidates) => {
    if (statusFilter === 'all') return candidateList;
    return candidateList.filter(candidate => candidate.status === statusFilter);
  };
  
  const applySorting = (candidateList: typeof allCandidates) => {
    let sorted;
    if (sortBy === 'match') {
      sorted = [...candidateList].sort((a, b) => b.matchScore - a.matchScore);
    } else {
      sorted = [...candidateList].sort((a, b) => a.name.localeCompare(b.name));
    }
    setCandidates(sorted);
  };
  
  const handleStatusFilter = (status: 'all' | 'new' | 'reviewed') => {
    setStatusFilter(status);
    applySorting(applyStatusFilter(
      searchQuery ? allCandidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.degree.toLowerCase().includes(searchQuery.toLowerCase())
      ) : allCandidates
    ));
  };
  
  const handleSort = (type: 'match' | 'name') => {
    setSortBy(type);
    if (type === 'match') {
      setCandidates([...candidates].sort((a, b) => b.matchScore - a.matchScore));
    } else {
      setCandidates([...candidates].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('match');
    setCandidates([...allCandidates].sort((a, b) => b.matchScore - a.matchScore));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Candidates</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Browse and filter candidates that match your job requirements
              </p>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search by name, skills, or education"
                  className="pl-10"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSearchQuery('');
                      applySorting(applyStatusFilter(allCandidates));
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusFilter('new')}
                >
                  New
                </Button>
                <Button 
                  variant={statusFilter === 'reviewed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusFilter('reviewed')}
                >
                  Reviewed
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('match')}
                >
                  <span>Match %</span>
                  {sortBy === 'match' && <Badge className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  <span>Name</span>
                  {sortBy === 'name' && <Badge className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                </Button>
              </div>
              
              {(searchQuery || statusFilter !== 'all' || sortBy !== 'match') && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Candidates List */}
          <div className="space-y-4">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No candidates match your filters.</p>
                <Button 
                  variant="link" 
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Candidates;
