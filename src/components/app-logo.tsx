import { cn } from "@/lib/utils";
import Image from "next/image";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative rounded-full overflow-hidden", className)} {...props}>
        <Image
            src="https://cdn.discordapp.com/attachments/986847691483017248/1425056874889482353/oXbFTfm.gif?ex=68e63323&is=68e4e1a3&hm=dc9607ebcfd087fe3a421310f303b3b0df5a7d7b40adad68f3cd83cad2a41fe0&"
            alt="The Harbour School Logo"
            unoptimized
            fill
            className="object-contain"
        />
    </div>
);

export default AppLogo;
