import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6 space-y-2">
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
            
            <Link href="/test">
              <Button className="w-full" variant="outline">
                Go to Test Page
              </Button>
            </Link>
            
            <div className="text-xs text-gray-500 mt-4 text-center">
              <p>If the main app isn't working, try the test page to verify core functionality.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
