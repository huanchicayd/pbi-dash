import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-3.5 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-28 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export function TableCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5">
              <Skeleton className="h-3.5 w-6" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
