import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { PremiumBackground } from '@/components/ui/PremiumBackground';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { CursorProvider } from '@/context/CursorContext';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect, lazy, Suspense } from 'react';

// ── Critical path — always bundled with the main chunk ─────────────────────
import Home from '@/pages/Home';

// ── Lazy chunks — only downloaded when the route is first visited ──────────
// Admin code (DnD, rich forms, file upload, ProjectsManager, ClientsManager,
// SettingsManager) is the biggest win; legal pages and ProjectDetail are also
// deferred because visitors rarely navigate there on first load.
const AdminLogin         = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard     = lazy(() => import('@/pages/AdminDashboard'));
const ProjectDetail      = lazy(() => import('@/pages/ProjectDetail'));
const PrivacyPolicy      = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions'));
const CookiePolicy       = lazy(() => import('@/pages/CookiePolicy'));
const NotFound           = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient();

// Minimal fallback — dark background, no flash of white
function PageFallback() {
  return <div className="min-h-screen bg-background" />;
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
}

function AppInner() {
  const [location] = useLocation();
  const isHome   = location === '/';
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
