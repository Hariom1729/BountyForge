import { MaintainerSidebar } from "./MaintainerSidebar";

export default function MaintainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <MaintainerSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
