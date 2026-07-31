import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import ProjectDetail from '@/pages/ProjectDetail';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import CookiePolicy from '@/pages/CookiePolicy';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { PremiumBackground } from '@/components/ui/PremiumBackground';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { CursorProvider } from '@/context/CursorContext';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  const [location] = useLocation();
  const isHome = location === '/';
  const isPublic = !location.startsWith('/admin');

  return (
    <>
      {isPublic && <PremiumBackground />}
      <CustomCursor />
      {isHome && <LoadingScreen />}
      <Router />
      {isHome && <CookieConsent />}
      <Toaster />
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <CursorProvider>
            <AppInner />
          </CursorProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
