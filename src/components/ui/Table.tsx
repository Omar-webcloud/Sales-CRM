import * as React from "react";
import clsx from "clsx";

export function Table({ className, ...props }: React.HTMLAttributes<
  HTMLTableElement
>) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <table className={clsx("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx("bg-zinc-50 dark:bg-zinc-900", className)} {...props} />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx(className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx(
        "border-b border-zinc-200/60 last:border-b-0 dark:border-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        "h-10 px-4 text-left align-middle font-medium text-zinc-700 dark:text-zinc-200",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx("p-4 align-middle text-zinc-800 dark:text-zinc-100", className)} {...props} />
  );
}

