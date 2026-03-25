"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Smile, Award, Settings } from "lucide-react";

const stats = [
  { icon: Users, value: 4932, label: "Expert Members" },
  { icon: Smile, value: 1401, label: "Satisfied Clients" },
  { icon: Award, value: 8184, label: "Problem Solve" },
  { icon: Settings, value: 1385, label: "Award Winner" },
];

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count}</div>;
}

export default function Stats() {
  return (
    <section
      className="py-20 lg:py-28 relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url(https://ext.same-assets.com/2464002308/3996784431.jpeg)" }}
    >
      <div className="absolute inset-0 bg-dark/90" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 border-2 border-primary rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Number */}
              <div className="font-teko text-5xl lg:text-6xl font-bold mb-2">
                <Counter end={stat.value} />
              </div>

              {/* Label */}
              <p className="font-teko text-lg uppercase tracking-wider text-white/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
