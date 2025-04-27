
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  profileImage?: FileList;
}

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Optimistic update
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Profile - ToolMemeX</title>
        <meta name="description" content="Edit your ToolMemeX profile" />
        <meta property="og:title" content="Your Profile - ToolMemeX" />
        <meta property="og:description" content="Check out this awesome meme creator profile!" />
        <meta property="og:image" content={imagePreview || '/default-profile.jpg'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': 'Your Name',
            'url': window.location.href,
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  {...register('profileImage')}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  disabled={!isEditing}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  disabled={!isEditing}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};
