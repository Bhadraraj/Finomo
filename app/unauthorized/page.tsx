'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p> 
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
          
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}