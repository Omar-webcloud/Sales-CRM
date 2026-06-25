import * as React from "react";

export default function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"flex-1 p-4 md:p-6 bg-zinc-50 dark:bg-black " + (className ?? "")}>
      {children}
    </div>
  );
}

