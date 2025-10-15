import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="h-full w-full"
            aria-label="The Harbour School Logo"
        >
            <circle cx="50" cy="50" r="48" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="2" />
            <path
                d="M25 60 Q35 40, 50 60 T75 60"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M30 75 Q40 55, 50 75 T70 75"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            />
            <path
                d="M35 90 Q45 70, 50 90 T65 90"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            />
             <circle cx="50" cy="30" r="12" fill="hsl(var(--accent))" />
        </svg>
    </div>
);

export default AppLogo;
