import { cn } from "@/lib/utils";
import Image from "next/image";

const AppLogo = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props}>
        <Image
            src="https://storage.googleapis.com/aifirebase-1.appspot.com/images%2Fgemini-pro-builder%2Fuser-E8tDxrC9yFhR4Y5jD6A0%2Flclt51m5%2Fgenerated_1.jpeg"
            alt="The Harbour School Logo"
            fill
            className="object-contain"
        />
    </div>
);

export default AppLogo;
