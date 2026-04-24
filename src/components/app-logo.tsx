import Image from "next/image";
import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative rounded-full overflow-hidden", className)} {...props}>
        <Image
            src="https://www.imghost.online/ib/YuTNsX5eknArWcm_1764130145.gif"
            alt="The Harbour School Logo"
            fill
            style={{ objectFit: 'contain' }}
            unoptimized
        />
    </div>
);

export default AppLogo;
