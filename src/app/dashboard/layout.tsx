"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Users, Briefcase, TrendingUp, HelpCircle, Newspaper, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirectTo=/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login?redirectTo=/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/portfolio', label: 'Portfolio', icon: ImageIcon },
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/services', label: 'Services', icon: Briefcase },
    { href: '/dashboard/stats', label: 'Stats', icon: TrendingUp },
    { href: '/dashboard/faqs', label: 'FAQs', icon: HelpCircle },
    { href: '/dashboard/news', label: 'News', icon: Newspaper },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-dark text-white p-6 overflow-y-auto z-40 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:block`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-teko uppercase text-primary tracking-wider">Binifox Admin</h2>
          <button
            onClick={closeSidebar}
            className="md:hidden text-white hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className="flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 py-3 px-3 rounded-lg text-gray-300 hover:text-white"
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-600 mt-8 pt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 py-3 px-3 rounded-lg w-full text-left font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 text-gray-400 hover:bg-primary/10 hover:text-primary transition-all duration-200 py-3 px-3 rounded-lg font-medium"
          >
            <span>←</span> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}
