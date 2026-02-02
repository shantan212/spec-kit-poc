import { apiPost } from './apiClient';

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    correlationId?: string;
    details?: ValidationError[];
  };
}

export class UserApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly correlationId?: string,
    public readonly details?: ValidationError[]
  ) {
    super(message);
    this.name = 'UserApiError';
  }
}

export async function createUser(request: CreateUserRequest): Promise<UserResponse> {
  try {
    const response = await apiPost<UserResponse>('/api/v1/users', request);
    return response;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { status: number; data?: ErrorResponse } };
      
      if (apiError.response?.status === 400) {
        const errorData = apiError.response.data?.error;
        throw new UserApiError(
          errorData?.code || 'VALIDATION_ERROR',
          errorData?.message || 'Invalid request parameters',
          errorData?.correlationId,
          errorData?.details
        );
      }
      
      if (apiError.response?.status === 409) {
        const errorData = apiError.response.data?.error;
        throw new UserApiError(
          errorData?.code || 'EMAIL_ALREADY_EXISTS',
          errorData?.message || 'A user with this email address already exists',
          errorData?.correlationId
        );
      }
    }
    
    throw error;
  }
}
