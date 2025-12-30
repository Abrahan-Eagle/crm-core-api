export interface UrlSignerService {
  sign(url: string, expirationInMinutes?: number): string;
}
