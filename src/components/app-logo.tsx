import { cn } from "@/lib/utils";
import Image from "next/image";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative rounded-full overflow-hidden", className)} {...props}>
        <Image
            src="https://cdn.discordapp.com/attachments/1019228237613781032/1424035545335726251/cIhuTVP.png?ex=68e27bf3&is=68e12a73&hm=6c23111c6b1d53e49e7b32f97d904d7964b474ce933e7aae2984d41a6dd059a7&"
            alt="The Harbour School Logo"
            fill
            className="object-contain"
        />
    </div>
);

export default AppLogo;
