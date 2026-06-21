import { ContributorSidebar } from "./ContributorSidebar";

export default function ContributorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ContributorSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
