export default function HomeLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className=" mx-auto bg-orange-50">
      {children}
      {modal}
    </div>
  );
}
