import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PixelNestLogo } from '@/components/ui/PixelNestLogo';
import { useAuthLogin } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();
  const login = useAuthLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          setLocation('/admin/dashboard');
        },
        onError: () => {
          setError('Invalid credentials');
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-noise">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-10">
          <PixelNestLogo size="lg" />
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <h1 className="text-2xl font-serif font-bold text-center mb-8">Admin Access</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center font-medium bg-destructive/10 py-2 rounded-md">
                {error}
              </p>
            )}
            
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {login.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}