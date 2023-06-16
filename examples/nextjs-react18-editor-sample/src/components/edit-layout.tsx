export function EditorLayout({
  children,
  control,
  className,
}: {
  children: React.ReactNode;
  control: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative h-9/10 overflow-hidden">
      {children}
      <div
        className="absolute top-0 right-0 h-full w-0 bg-white bg-opacity-80"
      >
        {control}
      </div>
    </div>
  );
}
