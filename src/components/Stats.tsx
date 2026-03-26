import { getStats } from "@/lib/queries";
import { ErrorFallback } from "./ErrorFallback";
import StatsClient from "./StatsClient";

export default async function Stats() {
  try {
    const stats = await getStats();

    return (
      <section
        className="py-20 lg:py-28 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(https://ext.same-assets.com/2464002308/3996784431.jpeg)" }}
      >
        <div className="absolute inset-0 bg-dark/90" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <StatsClient stats={stats} />
        </div>
      </section>
    );
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return (
      <section
        className="py-20 lg:py-28 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(https://ext.same-assets.com/2464002308/3996784431.jpeg)" }}
      >
        <div className="absolute inset-0 bg-dark/90" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ErrorFallback message="Unable to load statistics" />
        </div>
      </section>
    );
  }
}
