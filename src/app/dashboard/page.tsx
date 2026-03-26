"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Users, Briefcase, TrendingUp, HelpCircle, Newspaper, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  projects: number;
  teamMembers: number;
  services: number;
  faqs: number;
  stats: number;
  news: number;
}

export default function DashboardHome() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    projects: 0,
    teamMembers: 0,
    services: 0,
    faqs: 0,
    stats: 0,
    news: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, teamRes, servicesRes, faqsRes, statsRes, newsRes] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('team_members').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('faqs').select('id', { count: 'exact', head: true }),
          supabase.from('stats').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
        ]);

        setDashboardStats({
          projects: projectsRes.count || 0,
          teamMembers: teamRes.count || 0,
          services: servicesRes.count || 0,
          faqs: faqsRes.count || 0,
          stats: statsRes.count || 0,
          news: newsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Portfolio Projects',
      href: '/dashboard/portfolio',
      icon: ImageIcon,
      count: dashboardStats.projects,
      color: 'from-blue-500 to-blue-600',
      description: 'Manage your portfolio projects',
    },
    {
      title: 'Team Members',
      href: '/dashboard/team',
      icon: Users,
      count: dashboardStats.teamMembers,
      color: 'from-purple-500 to-purple-600',
      description: 'Manage your team members',
    },
    {
      title: 'Services',
      href: '/dashboard/services',
      icon: Briefcase,
      count: dashboardStats.services,
      color: 'from-orange-500 to-orange-600',
      description: 'Add and manage services',
    },
    {
      title: 'Statistics',
      href: '/dashboard/stats',
      icon: TrendingUp,
      count: dashboardStats.stats,
      color: 'from-green-500 to-green-600',
      description: 'Manage your statistics',
    },
    {
      title: 'FAQs',
      href: '/dashboard/faqs',
      icon: HelpCircle,
      count: dashboardStats.faqs,
      color: 'from-pink-500 to-pink-600',
      description: 'Manage frequently asked questions',
    },
    {
      title: 'News & Blog',
      href: '/dashboard/news',
      icon: Newspaper,
      count: dashboardStats.news,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Manage news and blog posts',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-teko uppercase tracking-wide text-dark mb-2">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage all your website content in one place
        </p>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-dark to-dark/80 text-white rounded-lg p-6 md:p-8 mb-8">
        <h2 className="text-xl font-teko uppercase tracking-wide mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.projects}</p>
            <p className="text-gray-300 text-sm">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.services}</p>
            <p className="text-gray-300 text-sm">Services</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.teamMembers}</p>
            <p className="text-gray-300 text-sm">Team Members</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.news}</p>
            <p className="text-gray-300 text-sm">News Posts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.faqs}</p>
            <p className="text-gray-300 text-sm">FAQs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{dashboardStats.stats}</p>
            <p className="text-gray-300 text-sm">Stats</p>
          </div>
        </div>
      </div>

      {/* Management Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-full -mr-8 -mt-8`} />

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>

                  {/* Title and Count */}
                  <h3 className="text-lg md:text-xl font-bold text-dark mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{card.description}</p>

                  {/* Count and Arrow */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl md:text-3xl font-teko font-bold text-primary">
                      {card.count}
                    </span>
                    <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/services"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 group"
          >
            <div className="p-3 bg-orange-500 text-white rounded-lg group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark">Add New Service</p>
              <p className="text-sm text-gray-600">Create a new service with details</p>
            </div>
            <ArrowRight className="ml-auto text-orange-500 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>

          <Link
            href="/dashboard/portfolio"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
          >
            <div className="p-3 bg-blue-500 text-white rounded-lg group-hover:scale-110 transition-transform">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark">Add New Project</p>
              <p className="text-sm text-gray-600">Showcase your portfolio work</p>
            </div>
            <ArrowRight className="ml-auto text-blue-500 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>

          <Link
            href="/dashboard/team"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
          >
            <div className="p-3 bg-purple-500 text-white rounded-lg group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark">Add Team Member</p>
              <p className="text-sm text-gray-600">Expand your team roster</p>
            </div>
            <ArrowRight className="ml-auto text-purple-500 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>

          <Link
            href="/dashboard/news"
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 group"
          >
            <div className="p-3 bg-indigo-500 text-white rounded-lg group-hover:scale-110 transition-transform">
              <Newspaper size={20} />
            </div>
            <div>
              <p className="font-semibold text-dark">Write News Post</p>
              <p className="text-sm text-gray-600">Share your latest updates</p>
            </div>
            <ArrowRight className="ml-auto text-indigo-500 group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
