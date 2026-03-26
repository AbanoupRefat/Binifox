import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Team from "@/components/Team";
import { getTeamMemberById, getTeamMembers } from "@/lib/queries";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Mail, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

export const metadata = {
  title: "Team Member - Binifox",
  description: "Learn more about our team member.",
};

export async function generateStaticParams() {
  try {
    const teamMembers = await getTeamMembers();
    return teamMembers.map((member) => ({
      id: member.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function TeamMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let teamMember;

  try {
    teamMember = await getTeamMemberById(id);
  } catch (error) {
    console.error("Error fetching team member:", error);
  }

  if (!teamMember) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Team member not found" />
        </main>
        <Footer />
      </>
    );
  }

  const socialLinks = [
    { icon: Facebook, url: teamMember.facebook_url, label: "Facebook" },
    { icon: Twitter, url: teamMember.twitter_url, label: "Twitter" },
    { icon: Instagram, url: teamMember.instagram_url, label: "Instagram" },
    { icon: Linkedin, url: teamMember.linkedin_url, label: "LinkedIn" },
  ];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Team Member</h1>
              <p className="text-white/70 text-lg">
                Get to know our talented team
              </p>
            </div>
          </div>
        </section>

        {/* Team Member Details Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Member Image */}
              {teamMember.image && (
                <div className="mb-12 rounded-lg overflow-hidden">
                  <img
                    src={teamMember.image}
                    alt={teamMember.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Member Info */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-teko font-bold text-dark mb-2">
                  {teamMember.name}
                </h2>
                <p className="text-xl text-primary font-semibold mb-6">
                  {teamMember.role}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-8">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return social.url && social.url !== "#" ? (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        title={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Member Bio */}
              <div className="prose prose-lg max-w-none mb-12 pb-8 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  This is the team member's bio section. You can add information about:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>Professional background and experience</li>
                  <li>Skills and expertise</li>
                  <li>Notable achievements</li>
                  <li>Interests and hobbies</li>
                  <li>Contact information</li>
                </ul>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8">
                <Link
                  href="/team"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Team
                </Link>
                <div className="flex gap-2">
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-dark" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-5 h-5 text-dark" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Team Members */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-3xl font-teko font-bold text-dark mb-12 text-center">
              Our Team
            </h3>
            <Team />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
