import Image from "next/image";
import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props}>
        <Image
            src="https://www.imghost.online/images/2024/07/20/logo.gif"
            alt="The Harbour School Logo"
            layout="fill"
            objectFit="contain"
            unoptimized // Required for GIFs
        />
    </div>
);

export default AppLogo;
