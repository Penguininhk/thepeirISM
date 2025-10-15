
'use client';

import { useRouter } from "next/navigation";
import { studentProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { toast } = useToast();
    const router = useRouter();

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name.substring(0, 2);
    };

    const handleProfileUpdate = () => {
        toast({
            title: "Profile Updated",
            description: "Your personal information has been successfully updated.",
        });
    }

    const handlePasswordChange = () => {
        toast({
            title: "Password Changed",
            description: "Your password has been successfully updated.",
        });
    }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
      <div>
        <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account and profile information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your avatar.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-6">
                 <div className="relative">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={studentProfile.avatarUrl} alt={studentProfile.name} />
                        <AvatarFallback>{getInitials(studentProfile.name)}</AvatarFallback>
                    </Avatar>
                     <Label htmlFor="picture-upload" className="absolute -bottom-2 -right-2">
                        <div className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                           <Camera className="h-4 w-4" />
                           <span className="sr-only">Change picture</span>
                        </div>
                     </Label>
                    <Input id="picture-upload" type="file" className="sr-only" />
                 </div>
                 <p className="text-sm text-muted-foreground">Click the camera icon to upload a new picture.</p>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={studentProfile.name.split(' ')[0]} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={studentProfile.name.split(' ')[1]} />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={studentProfile.email} />
          </div>
        </CardContent>
        <CardContent>
            <Button onClick={handleProfileUpdate}>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={handlePasswordChange}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
