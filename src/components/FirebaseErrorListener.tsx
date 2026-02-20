
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Log the full context for easier debugging in the console
      console.error('Firestore Permission Error Details:', {
        operation: error.context?.operation,
        path: error.context?.path,
        data: error.context?.requestResourceData
      });

      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `You don't have permission to ${error.context?.operation || 'access'} at ${error.context?.path || 'this location'}.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
