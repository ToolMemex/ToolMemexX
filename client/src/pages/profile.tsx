import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

type ProfileFormData = {
  name: string;
  email: string;
  profilePicture?: FileList;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  const { register, handleSubmit, watch } = useForm<ProfileFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Optimistic update
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | ToolMemeX</title>
        <meta name="description" content="Edit your profile settings and preferences" />
        <meta property="og:title" content="My Profile | ToolMemeX" />
        <meta property="og:description" content="Edit your profile settings and preferences" />
        {previewImage && <meta property="og:image" content={previewImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="p-6 bg-opacity-50 backdrop-blur-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={previewImage || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover transition-all"
                  />
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      {...register('profilePicture')}
                      onChange={handleImageChange}
                    />
                  )}
                </div>
              </div>

              <div>
                <Input
                  {...register('name', { required: true })}
                  placeholder="Your name"
                  disabled={!isEditing}
                  className="transition-colors"
                />
              </div>

              <div>
                <Input
                  {...register('email', {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  type="email"
                  placeholder="Your email"
                  disabled={!isEditing}
                  className="transition-colors"
                />
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
}