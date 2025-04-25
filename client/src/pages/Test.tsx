import React, { useState } from 'react';
import { generateCaptions } from '../lib/memeUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Simple test page to verify that the core functionality works without requiring server connectivity
 */
export default function Test() {
  const [captionStyle, setCaptionStyle] = useState('funny');
  const [captions, setCaptions] = useState<string[]>([]);
  const [testImage, setTestImage] = useState<string | null>(null);
  
  // Test generating captions
  const testGenerateCaptions = () => {
    const results = generateCaptions(captionStyle);
    setCaptions(results);
  };
  
  // Test image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ToolMemeX Test Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
          </div>
          
          {testImage && (
            <div className="mt-4">
              <h3 className="text-xl font-medium mb-2">Uploaded Image</h3>
              <div className="border border-gray-200 rounded-md overflow-hidden w-64 h-64">
                <img src={testImage} alt="Test upload" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Caption Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="style">Caption Style</Label>
            <Select value={captionStyle} onValueChange={setCaptionStyle}>
              <SelectTrigger id="style" className="mt-1">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="sarcastic">Sarcastic</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="techjokes">Tech Jokes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={testGenerateCaptions} className="mt-1">Generate Captions</Button>
          
          {captions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-medium mb-2">Generated Captions</h3>
              <div className="border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
                <ul className="list-disc pl-5 space-y-2">
                  {captions.map((caption, index) => (
                    <li key={index}>{caption}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <p>If this test page works, your ToolMemeX core functionality is working correctly.</p>
        <p className="mt-2">
          <a href="/" className="text-blue-500 hover:underline">Go to Main App</a>
        </p>
      </div>
    </div>
  );
}