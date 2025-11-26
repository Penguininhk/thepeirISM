import Image from "next/image";
import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props}>
        <Image
            src="https://www.imghost.online/ib/YuTNsX5eknArWcm_1764130145.gif"
            alt="The Harbour School Logo"
            layout="fill"
            objectFit="contain"
            unoptimized // Required for GIFs
        />
    </div>
);

export default AppLogo;
