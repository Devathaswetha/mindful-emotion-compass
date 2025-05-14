
"use client";
 
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  className?: string;
  animated?: boolean;
}

const AspectRatio = ({ className, animated = false, ...props }: AspectRatioProps) => (
  <AspectRatioPrimitive.Root 
    className={cn(
      animated && "overflow-hidden transition-all duration-300 hover:shadow-lg",
      className
    )}
    {...props} 
  />
);

export { AspectRatio };
