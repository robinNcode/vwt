import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect' }) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-white/5 rounded",
                variant === 'text' && "h-4 w-full",
                variant === 'circle' && "rounded-full",
                className
            )}
        />
    );
};

export default Skeleton;
