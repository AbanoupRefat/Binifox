import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSubServiceByIdWithMedia, getServiceById, getServices } from "@/lib/queries";
import { getGDriveEmbedUrl } from "@/lib/utils";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, Image as ImageIcon, Video } from "lucide-react";

export const metadata = {
  title: "Sub-Service Details - Binifox",
  description: "Learn more about our specialized sub-service.",
};

export default async function SubServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string; subServiceId: string }>;
}) {
  const { serviceId, subServiceId } = await params;
  let subService;
  let parentService;

  try {
    subService = await getSubServiceByIdWithMedia(subServiceId);
    parentService = await getServiceById(serviceId);
  } catch (error) {
    console.error("Error fetching sub-service details:", error);
  }

  if (!subService) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Sub-service not found" />
        </main>
        <Footer />
      </>
    );
  }

  const images = subService.sub_service_media.filter(m => m.type === 'image');
  const videos = subService.sub_service_media.filter(m => m.type === 'video');

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-dark">
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-dark/80 z-0" />
          {subService.image_url && (
            <div className="absolute inset-0 opacity-30">
              <img 
                src={subService.image_url} 
                alt={subService.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <Link 
                href={`/services/${serviceId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to {parentService?.title || 'Service'}
              </Link>
              <h1 className="heading-lg text-white mb-6">{subService.title}</h1>
              <p className="text-white/70 text-xl leading-relaxed">
                {subService.description || "Detailed overview of our specialized sub-service."}
              </p>
            </div>
          </div>
        </section>

        {/* Media Gallery Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            
            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-teko font-bold text-dark uppercase tracking-wider">Image Gallery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {images.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.caption || subService.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {image.caption && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <p className="text-white font-medium">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-teko font-bold text-dark uppercase tracking-wider">Video Showcase</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {videos.map((video) => {
                    const embedUrl = getGDriveEmbedUrl(video.url);
                    return (
                      <div key={video.id} className="space-y-4">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-gray-800">
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              className="w-full h-full"
                              allow="autoplay"
                              title={video.caption || "Sub-service Video"}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50">
                              Invalid Video URL
                            </div>
                          )}
                        </div>
                        {video.caption && (
                          <p className="text-gray-600 font-medium text-center italic">{video.caption}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {images.length === 0 && videos.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">No additional media available for this sub-service.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-3xl font-teko font-bold text-dark mb-4">Interested in this service?</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Contact us today to discuss how we can help you with {subService.title} and other professional solutions.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white px-10 py-4 font-teko font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-lg text-xl"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
