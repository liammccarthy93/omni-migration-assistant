import Image from "next/image";
import DashboardMigration from '@/components/DashboardMigration';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Omni Dashboard Migration Assistant</h1>
        <DashboardMigration />
      </main>
    </div>
  );
}
