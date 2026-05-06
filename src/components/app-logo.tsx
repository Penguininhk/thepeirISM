
'use client';

import { School } from "lucide-react";
import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative flex items-center justify-center bg-primary rounded-xl p-2 shadow-sm border border-primary-foreground/10", className)} {...props}>
        <School className="w-full h-full text-primary-foreground" strokeWidth={1.5} />
    </div>
);

export default AppLogo;
