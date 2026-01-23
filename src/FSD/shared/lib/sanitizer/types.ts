/**
 * Configuration options for URL sanitization
 */
export interface SanitizeOptions {
  /** Allow data URLs (default: false for security) */
  allowDataUrl?: boolean;
  /** Allow blob URLs (default: true) */
  allowBlobUrl?: boolean;
  /** Allowed protocols (default: ['http:', 'https:', 'ftp:']) */
  allowedProtocols?: string[];
  /** Additional regex patterns to validate */
  allowedPatterns?: RegExp | null;
  /** Require valid hostname (default: true) */
  requireValidHostname?: boolean;
  /** Maximum URL length (default: 2048) */
  maxLength?: number;
  /** Remove credentials from URL (default: true) */
  removeCredentials?: boolean;
}

/**
 * Result for sanitized anchor href
 */
export interface SanitizedAnchorResult {
  url: string;
  rel?: string;
}

/**
 * Supported image MIME types
 */
export type AllowedImageMimeType =
  | "image/jpeg"
  | "image/jpg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "image/bmp"
  | "image/x-icon";

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
