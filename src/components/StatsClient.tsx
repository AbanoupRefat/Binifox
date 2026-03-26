"use client";

import { useEffect, useState, useRef } from "react";
import { getIcon } from "@/lib/iconMap";
import type { Database } from "@/lib/database.types";

type Stat = Database['public']['Tables']['stats']['Row'];

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count}</div>;
}

export default function StatsClient({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
      {stats.map((stat) => {
        const Icon = getIcon(stat.icon_name);
        return (
          <div key={stat.id} className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-primary rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div className="font-teko text-5xl lg:text-6xl font-bold mb-2">
              <Counter end={stat.value} />
            </div>
            <p className="font-teko text-lg uppercase tracking-wider text-white/80">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
