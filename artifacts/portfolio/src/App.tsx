import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect, lazy, Suspense } from 'react';

// ── Critical path — always bundled with the main chunk ────────────────────────
import Home from '@/pages/Home';

// ── Lazy chunks — loaded only when the route is first visited ─────────────────
// This keeps the visitor-facing bundle lean; admin code (DnD, rich forms,
// file upload, SettingsManager, ProjectsManager, ClientsManager) is only
// downloaded when someone actually navigates to /admin or /admin/dashboard.
const AdminLogin        = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard    = lazy(() => import('@/pages/AdminDashboard'));
const ProjectDetail     = lazy(() => import('@/pages/ProjectDetail'));
const PrivacyPolicy     = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions'));
const CookiePolicy      = lazy(() => import('@/pages/CookiePolicy'));
const NotFound          = lazy(() => import('@/pages/not-found'));
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
