import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonEditor() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    </div>
  );
}
