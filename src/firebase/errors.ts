
'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  
  constructor(context: SecurityRuleContext) {
    const message = `FirestorePermissionError: Missing or insufficient permissions at ${context.path} during ${context.operation}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    
    // Ensure the error is properly enumerable for logging
    Object.defineProperty(this, 'message', { enumerable: true });
    Object.defineProperty(this, 'context', { enumerable: true });
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
    };
  }
}
