// src/pages/Profile.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSEO } from "@/hooks/useSEO";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profilePicture: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  const SEO = useSEO({
    title: `${watch("name") || "Profile"} | ToolMemeX`,
    description: `Check out ${watch("name") || "this"} profile and meme creations.`,
    image: previewUrl || "/default-profile.png",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {SEO}
      <div className="container max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

        <Card className="p-8 shadow-xl">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <Skeleton className="h-12 w-40 mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <Input
                  {...register("name")}
                  placeholder="Name"
                  className="text-lg"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="text-lg"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}