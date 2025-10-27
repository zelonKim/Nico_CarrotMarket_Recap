import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-neutral-800  mx-auto bg-orange-50">
      {children}
      <TabBar />
    </div>
  );
}
