"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Users, Briefcase, TrendingUp, HelpCircle, Newspaper, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white p-6 hidden md:block overflow-y-auto">
        <h2 className="text-2xl font-teko uppercase text-primary mb-8 tracking-wider">Binifox Admin</h2>
        <nav className="space-y-3">
          <Link href="/dashboard" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/portfolio" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <ImageIcon size={18} /> Portfolio
          </Link>
          <Link href="/dashboard/team" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <Users size={18} /> Team
          </Link>
          <Link href="/dashboard/services" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <Briefcase size={18} /> Services
          </Link>
          <Link href="/dashboard/stats" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <TrendingUp size={18} /> Stats
          </Link>
          <Link href="/dashboard/faqs" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <HelpCircle size={18} /> FAQs
          </Link>
          <Link href="/dashboard/news" className="flex items-center gap-3 hover:text-primary transition-colors py-2">
            <Newspaper size={18} /> News
          </Link>
          
          <div className="border-t border-gray-600 mt-8 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors py-2 w-full text-left"
            >
              <LogOut size={18} /> Logout
            </button>
            <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors py-2">
              &larr; Back to Website
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}