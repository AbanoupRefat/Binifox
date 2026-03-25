import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { getTeamMembers } from "@/lib/queries";
import { ErrorFallback } from "./ErrorFallback";

export default async function Team() {
  try {
    const teamMembers = await getTeamMembers();

    return (
      <section id="team" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="section-title">Our Team</p>
            <h2 className="heading-md text-dark">Expert Members.</h2>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group">
                {/* Image */}
                <div className="relative h-80 overflow-hidden mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />

                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.facebook_url && (
                      <a
                        href={member.facebook_url}
                        className="w-10 h-10 bg-white text-dark flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        className="w-10 h-10 bg-white text-dark flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        className="w-10 h-10 bg-white text-dark flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        className="w-10 h-10 bg-white text-dark flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-teko text-2xl uppercase text-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-12">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    return <ErrorFallback message="Unable to load team members. Please try again later." />
  }
}
