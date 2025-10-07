import { cn } from "@/lib/utils";
import Image from "next/image";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative rounded-full overflow-hidden", className)} {...props}>
        <Image
            src="https://storage.googleapis.com/aifirebase/project-1-the-pier/the-harbour-school-logo.jpg"
            alt="The Harbour School Logo"
            fill
            className="object-contain"
        />
    </div>
);

export default AppLogo;
