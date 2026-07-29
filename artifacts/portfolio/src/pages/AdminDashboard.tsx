import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useGetAuthMe, useAuthLogout } from '@workspace/api-client-react';
import { PixelNestLogo } from '@/components/ui/PixelNestLogo';
import { LayoutGrid, Settings, LogOut, Loader2 } from 'lucide-react';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { SettingsManager } from '@/components/admin/SettingsManager';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetAuthMe({
    query: {
      retry: false
    }
  });
  
  const logout = useAuthLogout();
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');

  useEffect(() => {
    if (isError) {
      setLocation('/admin');
    }
  }, [isError, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation('/admin')
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-6 border-b border-border">
          <PixelNestLogo size="sm" />
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'projects' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-border/50 hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Projects
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-border/50 hover:text-foreground'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64">
        <div className="p-10 max-w-6xl mx-auto">
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </main>
    </div>
  );
}