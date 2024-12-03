import { Skeleton } from "@/components/ui/skeleton";

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <tr key={index} className="border-b last:border-0">
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="px-4 py-2">
            <Skeleton className="h-4 w-20" />
          </td>
        </tr>
      ))}
    </>
  );
}