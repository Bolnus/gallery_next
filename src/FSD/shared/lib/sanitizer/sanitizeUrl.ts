import { AllowedImageMimeType, SanitizedAnchorResult, SanitizeOptions, ValidationResult } from "./types";

// List of allowed MIME types for images
const allowedImageMimes: AllowedImageMimeType[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/x-icon"
];

/**
 * Validate data URLs
 * @param dataUrl - The data URL to validate
 * @returns Validation result object
 */
function isValidDataUrl(dataUrl: string): ValidationResult {
  // Basic data URL format validation
  const dataUrlPattern: RegExp =
    /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-=.]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*)$/i;

  if (!dataUrlPattern.test(dataUrl)) {
    return { isValid: false, error: "Invalid data URL format" };
  }

  // Extract MIME type
  const mimeMatch: RegExpMatchArray | null = /^data:([^;,]+)/i.exec(dataUrl);
  if (!mimeMatch) {
    return { isValid: false, error: "Unable to extract MIME type" };
  }

  const mimeType: string = mimeMatch[1].toLowerCase();

  // For img src, only allow image MIME types
  const isValidMime: boolean = (allowedImageMimes as string[]).includes(mimeType);

  return {
    isValid: isValidMime,
    error: isValidMime ? undefined : `Unsupported MIME type: ${mimeType}`
  };
}

/**
 * Validate hostname
 * @param hostname - Hostname to validate
 * @returns Validation result object
 */
function isValidHostname(hostname: string): ValidationResult {
  // Basic hostname validation
  const hostnamePattern: RegExp = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

  if (!hostnamePattern.test(hostname)) {
    return { isValid: false, error: "Invalid hostname format" };
  }

  // Additional checks for common issues
  if (hostname.includes("..")) {
    return { isValid: false, error: "Hostname contains consecutive dots" };
  }

  if (hostname.startsWith(".") || hostname.endsWith(".")) {
    return { isValid: false, error: "Hostname starts or ends with dot" };
  }

  if (hostname.length > 253) {
    return { isValid: false, error: "Hostname exceeds maximum length of 253 characters" };
  }

  // Check each label
  const labels: string[] = hostname.split(".");
  for (const label of labels) {
    if (label.length > 63) {
      return { isValid: false, error: `Label "${label}" exceeds maximum length of 63 characters` };
    }

    if (label.startsWith("-") || label.endsWith("-")) {
      return { isValid: false, error: `Label "${label}" starts or ends with hyphen` };
    }
  }

  return { isValid: true };
}

/**
 * Options specific to image source sanitization
 */
interface ImgSrcOptions extends SanitizeOptions {
  /** Additional attributes for image elements */
  imgAttributes?: Partial<HTMLImageElement>;
}

/**
 * Specialized sanitizer for img src attributes
 * @param url - URL to sanitize for image source
 * @param options - Image-specific options
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeImgSrc(url?: string, options: Partial<ImgSrcOptions> = {}): string | null {
  const imgOptions: SanitizeOptions = {
    allowDataUrl: false, // Usually disable data URLs for external images
    allowedProtocols: ["http:", "https:"],
    allowedPatterns: null,
    requireValidHostname: true,
    maxLength: 2048,
    removeCredentials: true,
    ...options
  };

  return sanitizeUrl(url, imgOptions);
}

/**
 * Options specific to anchor href sanitization
 */
interface AHrefOptions extends SanitizeOptions {
  /** Automatically add rel="noopener noreferrer" for external links */
  addNoopener?: boolean;
  /** Target attribute for the link */
  target?: string;
}

/**
 * Specialized sanitizer for a href attributes
 * @param url - URL to sanitize for anchor href
 * @param options - Anchor-specific options
 * @returns Sanitized URL with optional rel attribute or null if invalid
 */
export function sanitizeAHref(url?: string, options: AHrefOptions = {}): SanitizedAnchorResult | null {
  const hrefOptions: SanitizeOptions = {
    allowedProtocols: ["http:", "https:", "ftp:", "mailto:", "tel:"],
    allowDataUrl: false,
    allowedPatterns: null,
    requireValidHostname: true,
    maxLength: 2048,
    removeCredentials: true,
    ...options
  };

  const sanitized: string | null = sanitizeUrl(url, hrefOptions);

  if (!sanitized) {
    return null;
  }

  const result: SanitizedAnchorResult = { url: sanitized };

  // Add rel="noopener noreferrer" for external links if enabled
  if (
    options.addNoopener !== false &&
    global.window &&
    !sanitized.startsWith(window.location.origin) &&
    (sanitized.startsWith("http:") || sanitized.startsWith("https:"))
  ) {
    result.rel = "noopener noreferrer";
  }

  return result;
}

function removeCredentialsOnDemand(parsedUrl: URL, removeCredentials: boolean) {
  if (removeCredentials) {
    parsedUrl.username = "";
    parsedUrl.password = "";
  }
}

function isValidBlob(sanitizedUrl: string, allowedProtocols: string[]): boolean {
  // For blob URLs, validate the embedded URL
  const blobMatch: RegExpMatchArray | null = /^blob:(https?:\/\/.+)$/.exec(sanitizedUrl);
  if (blobMatch) {
    const innerUrl: string = sanitizedUrl.substring(5); // Remove 'blob:'
    const innerParsed: URL = new URL(innerUrl);
    if (!allowedProtocols.includes(innerParsed.protocol.toLowerCase())) {
      return false;
    }
  } else {
    return false;
  }
  return true;
}

function isEmptyString(str?: string): str is undefined {
  return typeof str !== "string" || !str.trim();
}

function isValidBlobOrData(config: Required<SanitizeOptions>, protocol: string, sanitizedUrl: string): boolean {
  // Check for blob URLs
  if (config.allowBlobUrl && protocol === "blob:") {
    const isValid = isValidBlob(sanitizedUrl, config.allowedProtocols);
    if (!isValid) {
      return false;
    }
  } else if (config.allowDataUrl && protocol === "data:") {
    // Validate data URLs if allowed
    const validation: ValidationResult = isValidDataUrl(sanitizedUrl);
    if (!validation.isValid) {
      return false;
    }
  } else {
    return false;
  }
  return true;
}

/**
 * Sanitize URL for use in img src or a href attributes
 * @param url - The URL to sanitize
 * @param options - Configuration options
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url?: string, options: SanitizeOptions = {}): string | null {
  if (isEmptyString(url)) {
    return null;
  }

  const defaultOptions: Required<SanitizeOptions> = {
    allowDataUrl: false,
    allowBlobUrl: true,
    allowedProtocols: ["http:", "https:", "ftp:"],
    allowedPatterns: null,
    requireValidHostname: true,
    maxLength: 2048,
    removeCredentials: true
  };

  const config: Required<SanitizeOptions> = { ...defaultOptions, ...options };

  // Check length
  if (url.length > config.maxLength) {
    console.warn(`URL exceeds maximum length of ${config.maxLength} characters`);
    return null;
  }

  let sanitizedUrl: string = url.trim();

  // Remove control characters and dangerous characters
  // eslint-disable-next-line no-control-regex
  sanitizedUrl = sanitizedUrl.replace(/[\x00-\x1F\x7F]/g, "");

  // Remove javascript: and other dangerous protocols
  sanitizedUrl = sanitizedUrl.replace(/^(javascript|vbscript|data|file):/i, "");

  try {
    // Parse URL to validate structure
    const parsedUrl: URL = new URL(sanitizedUrl, global.window ? window.location.href : undefined);
    const protocol: string = parsedUrl.protocol.toLowerCase();

    // Protocol validation
    if (!config.allowedProtocols.includes(protocol) && !isValidBlobOrData(config, protocol, sanitizedUrl)) {
      return null;
    }

    removeCredentialsOnDemand(parsedUrl, config.removeCredentials);

    // Validate hostname if required
    // validateHostname()
    if (config.requireValidHostname && parsedUrl.hostname && !isValidHostname(parsedUrl.hostname).isValid) {
      return null;
    }

    // Additional pattern validation
    if (config.allowedPatterns && !config.allowedPatterns.test(sanitizedUrl)) {
      return null;
    }

    // Return the sanitized URL
    return parsedUrl.toString();
  } catch (error: unknown) {
    // URL parsing failed
    const errorMessage: string = error instanceof Error ? error.message : "Unknown URL parsing error";
    console.warn("URL parsing failed:", errorMessage);
    return null;
  }
}
