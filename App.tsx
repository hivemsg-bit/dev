import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Process } from './components/Process';
import { AboutUs } from './components/AboutUs';
import { TestSeriesExplorer } from './components/TestSeriesExplorer';
import { Pricing } from './components/Pricing';
import { Mentors } from './components/Mentors';
import { SEOImpact } from './components/SEOImpact';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GuaranteeSection } from './components/GuaranteeSection';
import { Results } from './components/Results';
import { StudentTestimonials } from './components/StudentTestimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { DetailedPages } from './components/DetailedPages';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { StudentLogin } from './components/StudentLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherLogin } from './components/TeacherLogin';
import { TeacherPanel } from './components/TeacherPanel';
import { Checkout } from './components/Checkout';
import { auth, signOut } from './firebaseConfig';

export type ViewType = 'home' | 'about-detail' | 'test-detail' | 'process-detail' | 'mentors-detail' | 'pricing-detail' | 'topic-detail' | 'admin-panel' | 'admin-login' | 'teacher-login' | 'teacher-panel' | 'test-series-detail' | 'student-login' | 'student-dashboard' | 'checkout';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  type: string;
}

// Plans updated with specific banner-style images and counts like the screenshot
const INITIAL_PLANS = [
  {
    id: 'plan-1',
    name: "Detailed Test Series",
    priceBase: 1999,
    discount: 65,
    seriesCount: "12 Series",
    studentCount: "450+ Students",
    desc: "Scheduled tests for disciplined study",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    features: ["12 Mock Tests", "Detailed Evaluation", "ICAI Pattern Based Questions"]
  },
  {
    id: 'plan-2',
    name: "Unscheduled Series",
    priceBase: 2499,
    discount: 65,
    seriesCount: "Unlimited",
    studentCount: "1.2k+ Students",
    desc: "Flexible - Write anytime till exams",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    features: ["Valid till Exam Date", "Priority Evaluation", "Unlimited Doubt Solving"]
  },
  {
    id: 'plan-3',
    name: "Fast Track Series",
    priceBase: 999,
    discount: 65,
    seriesCount: "5 Series",
    studentCount: "800+ Students",
    desc: "Quick revision for last month",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    features: ["2 Full Syllabus Tests", "Standard Evaluation", "Suggested Answers"]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [dynamicPlans, setDynamicPlans] = useState(INITIAL_PLANS);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
    const teacherAuth = localStorage.getItem('teacher_auth');
    if (teacherAuth === 'true') {
      setIsTeacherLoggedIn(true);
    }
    const studentEmail = localStorage.getItem('student_email');
    if (studentEmail) {
      setIsStudentLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'admin-login') {
        if (isAdminLoggedIn) {
          setView('admin-panel');
        } else {
          setView('admin-login');
        }
        return;
      }

      if (hash === 'teacher-login') {
        if (isTeacherLoggedIn) {
          setView('teacher-panel');
        } else {
          setView('teacher-login');
        }
        return;
      }

      if (hash.startsWith('topic-')) {
        const topicName = hash.replace('topic-', '').replace(/-/g, ' ');
        setSelectedTopic(topicName);
        setView('topic-detail');
      } else if (['home', 'about-detail', 'test-detail', 'process-detail', 'mentors-detail', 'pricing-detail', 'admin-panel', 'teacher-panel', 'test-series-detail', 'student-login', 'student-dashboard', 'checkout'].includes(hash)) {
        
        if (hash === 'admin-panel' && !isAdminLoggedIn) {
          window.location.hash = 'admin-login';
          setView('admin-login');
          return;
        }

        if (hash === 'teacher-panel' && !isTeacherLoggedIn) {
          window.location.hash = 'teacher-login';
          setView('teacher-login');
          return;
        }

        setView(hash as ViewType || 'home');
        setSelectedTopic(null);
      } else {
        setView('home');
        setSelectedTopic(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminLoggedIn, isTeacherLoggedIn]);

  const navigate = (newView: ViewType, topic?: string) => {
    if (newView === 'topic-detail' && topic) {
      const slug = topic.toLowerCase().replace(/\s+/g, '-');
      window.location.hash = `topic-${slug}`;
      setSelectedTopic(topic);
    } else {
      window.location.hash = newView;
      setSelectedTopic(null);
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  const addToCart = (item: CartItem) => {
    if (!cart.find(c => c.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('admin_auth', 'true');
    navigate('admin-panel');
  };

  const handleTeacherLogin = () => {
    setIsTeacherLoggedIn(true);
    localStorage.setItem('teacher_auth', 'true');
    navigate('teacher-panel');
  };

  const handleAdminLogout = () => {
    signOut(auth); 
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin_auth');
    navigate('home');
  };

  const handleTeacherLogout = () => {
    signOut(auth); 
    setIsTeacherLoggedIn(false);
    localStorage.removeItem('teacher_auth');
    navigate('home');
  };

  const handleStudentLogout = () => {
    signOut(auth); 
    setIsStudentLoggedIn(false);
    localStorage.removeItem('student_email');
    navigate('home');
  };

  const isDashboardView = view === 'admin-panel' || view === 'admin-login' || view === 'teacher-panel' || view === 'teacher-login' || view === 'student-dashboard';

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden">
      {!isDashboardView && <Navbar onNavigate={(v) => navigate(v)} currentView={view} cartCount={cart.length} />}
      
      <main>
        {view === 'home' ? (
          <>
            <Hero />
            <Pricing plans={dynamicPlans} onDetail={() => navigate('pricing-detail')} onAddToCart={addToCart} />
            <TrustBar />
            <GuaranteeSection />
            <Process onDetail={() => navigate('process-detail')} />
            <AboutUs onDetail={() => navigate('about-detail')} />
            <TestSeriesExplorer onDetail={() => navigate('test-series-detail')} />
            <SEOImpact onTopicClick={(topic) => navigate('topic-detail', topic)} />
            <WhyChooseUs />
            <Mentors onDetail={() => navigate('mentors-detail')} />
            <Results />
            <StudentTestimonials />
            <FAQ />
          </>
        ) : view === 'checkout' ? (
          <Checkout cart={cart} onRemoveItem={removeFromCart} onBack={() => navigate('home')} />
        ) : view === 'admin-panel' ? (
          <AdminPanel 
            plans={dynamicPlans} 
            onUpdatePlans={setDynamicPlans}
            onLogout={handleAdminLogout} 
            onBack={() => navigate('home')} 
          />
        ) : view === 'teacher-panel' ? (
          <TeacherPanel 
            onLogout={handleTeacherLogout} 
            onBack={() => navigate('home')} 
          />
        ) : view === 'admin-login' ? (
          <AdminLogin onLoginSuccess={handleAdminLogin} onBack={() => navigate('home')} />
        ) : view === 'teacher-login' ? (
          <TeacherLogin onLoginSuccess={handleTeacherLogin} onBack={() => navigate('home')} />
        ) : view === 'student-login' ? (
          <StudentLogin onLoginSuccess={() => { setIsStudentLoggedIn(true); navigate('student-dashboard'); }} onBack={() => navigate('home')} />
        ) : view === 'student-dashboard' ? (
          isStudentLoggedIn ? (
            <StudentDashboard onLogout={handleStudentLogout} />
          ) : (
            <StudentLogin onLoginSuccess={() => { setIsStudentLoggedIn(true); navigate('student-dashboard'); }} onBack={() => navigate('home')} />
          )
        ) : (
          <DetailedPages 
            view={view} 
            topic={selectedTopic} 
            onBack={() => navigate('home')} 
            onNavigate={(v, t) => navigate(v, t)}
            onAddToCart={addToCart}
          />
        )}
      </main>
      
      {!isDashboardView && <Footer onNavigate={(v) => navigate(v)} />}
    </div>
  );
};

export default App;