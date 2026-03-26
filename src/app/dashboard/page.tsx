export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-2">
        Welcome to your Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Select an option from the sidebar to manage your website content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold">Total Projects</h3>
          <p className="text-3xl text-primary font-teko mt-2">Manage</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold">Team Members</h3>
          <p className="text-3xl text-primary font-teko mt-2">Manage</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold">Content Sections</h3>
          <p className="text-3xl text-primary font-teko mt-2">8</p>
        </div>
      </div>
    </div>
  );
}
