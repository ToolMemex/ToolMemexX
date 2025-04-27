import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  profilePicture: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  const SEO = useSEO({
    title: `${watch('name') || 'Profile'} | ToolMemeX`, 
    description: `Check out ${watch('name') || 'this'} profile and meme creations`,
    image: previewUrl || '/default-profile.png',
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
      // Optimistic update
      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${watch('name') || 'My'} Profile | ToolMemeX`}</title> {/*Dynamic title*/}
        <meta name="description" content={`Check out ${watch('name') || 'this'} profile and meme creations`} /> {/*Dynamic description*/}
        {previewUrl && <meta property="og:image" content={previewUrl} />}
        <meta property="og:title" content={`${watch('name') || 'My'} Profile | ToolMemeX`} /> {/*Dynamic og:title*/}
        <meta property="og:description" content={`Check out ${watch('name') || 'this'} profile and meme creations`} /> {/*Dynamic og:description*/}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input {...register('name')} placeholder="Name" />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Input {...register('email')} type="email" placeholder="Email" />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-4"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}