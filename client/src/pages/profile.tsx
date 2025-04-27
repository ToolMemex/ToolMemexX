// src/pages/Profile.tsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; 
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet"; 
import { cn } from "@/lib/utils"; 
import { useQuery } from "react-query"; 
import { toast } from "react-toastify"; 

interface UserProfile {
  name: string;
  bio?: string;
  avatarUrl?: string;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch("/api/user-profile");
  return response.json();
};

const ProfileContent = () => {
  const { data: profile, error, isLoading, isError, refetch } = useQuery('userProfile', fetchUserProfile, {
    retry: 3, 
    refetchOnWindowFocus: false, 
    onError: (err) => {
      toast.error("Failed to load profile. Please try again.");
      console.error("Error fetching profile:", err);
    },
    staleTime: 300000, // Cache data for 5 minutes
    cacheTime: 600000, // Cache will be garbage collected after 10 minutes
  });

  const isMobile = window.innerWidth <= 640;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-24 w-24 rounded-full shimmer-skeleton" />
        <Skeleton className="h-8 w-48 shimmer-skeleton" />
        <Skeleton className="h-4 w-64 shimmer-skeleton" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 space-y-2">
        <h2 className="text-2xl font-semibold">Oops! Something went wrong.</h2>
        <p className="text-sm">We couldn't load your profile. <button onClick={() => refetch()} className="underline text-blue-500">Try again</button></p>
      </div>
    );
  }

  if (!profile) {
    throw new Error("Failed to load profile.");
  }

  return (
    <>
      <Helmet>
        <title>{`${profile.name}'s Profile | MyApp`}</title>
        <meta name="description" content={profile.bio || "User profile on MyApp"} />
        <meta property="og:title" content={`${profile.name}'s Profile`} />
        <meta property="og:description" content={profile.bio || "User profile on MyApp"} />
        <meta property="og:image" content={profile.avatarUrl ?? "/placeholder-avatar.png"} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <LazyImage src={profile.avatarUrl ?? "/placeholder-avatar.png"} alt={`${profile.name}'s avatar`} />
        </div>

        <h1 className="text-4xl font-bold">{`Welcome, ${profile.name}!`}</h1>

        {profile.bio && (
          <p className="text-lg text-muted-foreground max-w-md mx-auto">{profile.bio}</p>
        )}
      </motion.div>
    </>
  );
};

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("/placeholder-avatar.png");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgSrc(src);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    const imgElement = document.createElement("img");
    imgElement.src = src;
    observer.observe(imgElement);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'transition-opacity duration-500 opacity-100' : 'opacity-0'}`}
        style={{ transition: "opacity 0.5s ease-in-out" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/placeholder-avatar.png";
          toast.error("Failed to load avatar image.");
        }}
      />
      {!isLoaded && (
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-full"></div>
      )}
    </div>
  );
};

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="text-center text-red-500 space-y-2">
    <h2 className="text-2xl font-semibold">Something went wrong.</h2>
    <p className="text-sm">{error.message}</p>
  </div>
);

const Profile = () => {
  return (
    <div className={cn("flex min-h-screen items-center justify-center px-4 bg-background text-foreground transition-colors")}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ProfileContent />
      </ErrorBoundary>
    </div>
  );
};

export default Profile;