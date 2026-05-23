import { apiRequest } from "@/shared/api/axiosRequest";

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  userId: number;
  userUuid: string;
  nickName: string;
  profileImageUrl: string | null;
  provider: string;
  emailVerified: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface GoogleLoginResult {
  user: AuthUser;
  newUser: boolean;
  newConnection: boolean;
  token: AuthToken;
}

export interface AuthenticatedUserResponse {
  userId: number;
  userUuid: string;
  authType: string;
  provider: string;
  jti: string;
}

export interface GuestAccessLogRequest {
  deviceId: string;
  targetPath: string;
  appVersion?: string;
  platform?: string;
}

export async function loginWithGoogle(request: GoogleLoginRequest): Promise<GoogleLoginResult> {
  console.log("[jang][authApi] POST /auth/google request", {
    hasIdToken: Boolean(request.idToken),
    idTokenLength: request.idToken?.length ?? 0,
  });

  const response = await apiRequest<ApiResponse<GoogleLoginResult>, GoogleLoginRequest>("/auth/google", {
    method: "POST",
    body: request,
  });

  console.log("[jang][authApi] POST /auth/google response", {
    code: response.code,
    hasUser: Boolean(response.data?.user),
    hasToken: Boolean(response.data?.token?.accessToken),
    expiresIn: response.data?.token?.expiresIn,
    refreshTokenExpiresIn: response.data?.token?.refreshTokenExpiresIn,
    hasRefreshToken: Boolean(response.data?.token?.refreshToken),
    userId: response.data?.user?.userId,
  });

  return response.data;
}

export async function refreshAuthToken(request: RefreshTokenRequest): Promise<{ token: AuthToken }> {
  console.log("[jang][authApi] POST /auth/refresh request", {
    hasRefreshToken: Boolean(request.refreshToken),
    refreshTokenLength: request.refreshToken?.length ?? 0,
  });

  const response = await apiRequest<ApiResponse<{ token: AuthToken }>, RefreshTokenRequest>("/auth/refresh", {
    method: "POST",
    body: request,
  });

  console.log("[jang][authApi] POST /auth/refresh response", {
    code: response.code,
    hasAccessToken: Boolean(response.data?.token?.accessToken),
    hasRefreshToken: Boolean(response.data?.token?.refreshToken),
    expiresIn: response.data?.token?.expiresIn,
    refreshTokenExpiresIn: response.data?.token?.refreshTokenExpiresIn,
  });

  return response.data;
}

export async function getAuthMe(accessToken: string): Promise<AuthenticatedUserResponse> {
  console.log("[jang][authApi] GET /auth/me request", {
    hasAccessToken: Boolean(accessToken),
    accessTokenLength: accessToken?.length ?? 0,
  });

  const response = await apiRequest<ApiResponse<AuthenticatedUserResponse>>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("[jang][authApi] GET /auth/me response", {
    code: response.code,
    userId: response.data?.userId,
    authType: response.data?.authType,
  });

  return response.data;
}

export async function logGuestAccess(request: GuestAccessLogRequest): Promise<void> {
  console.log("[jang][authApi] POST /auth/guest-access request", request);

  await apiRequest<ApiResponse<null>, GuestAccessLogRequest>("/auth/guest-access", {
    method: "POST",
    body: request,
  });

  console.log("[jang][authApi] POST /auth/guest-access success", {
    deviceId: request.deviceId,
    targetPath: request.targetPath,
  });
}
