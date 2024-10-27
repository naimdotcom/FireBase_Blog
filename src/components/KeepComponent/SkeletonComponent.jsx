import { Skeleton, SkeletonLine } from "keep-react";

export const SkeletonComponent = () => {
  return (
    <div className="">
      <Skeleton className="w-full space-y-2.5 xl:max-w-md">
        <SkeletonLine className="h-52 w-full" />
        <SkeletonLine className="h-4 w-full" />
      </Skeleton>
    </div>
  );
};
