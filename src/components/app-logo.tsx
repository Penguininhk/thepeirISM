import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const AppLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("text-primary", props.className)}
    {...props}
  >
    <path d="M12 22V8" />
    <path d="M5 12H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3" />
    <path d="M19 12h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3" />
    <path d="M2 12h20" />
    <path d="M12 2v2" />
    <path d="M12 8a4 4 0 0 0-4 4" />
    <path d="M12 8a4 4 0 0 1 4 4" />
  </svg>
);

export default AppLogo;
