import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" mx-auto bg-orange-50">
      {children}
      <TabBar />
    </div>
  );
}
