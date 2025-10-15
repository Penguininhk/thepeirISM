import Image from "next/image";
import { cn } from "@/lib/utils";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props}>
        <Image
            src="https://cdn.discordapp.com/attachments/1260848360634646531/1264235257147752490/logo.gif?ex=669d2d14&is=669bd794&hm=7a3940173b87a8e520357731354f3910565839077227c2f012870f2f31f95304&"
            alt="The Harbour School Logo"
            layout="fill"
            objectFit="contain"
            unoptimized // Required for GIFs
        />
    </div>
);

export default AppLogo;
