export interface LoginRequest {
  username: string;
  password: string; // base64(RSA encrypted)
}

export interface TokenResponse {
  access_token: string;
}

export interface PublicKeyResponse {
  public_key: string; // PEM
}
