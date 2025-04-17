export interface OmniEnvironment {
  baseUrl: string;
  token: string;
}

export const OMNI_CONFIG = {
  source: {
    baseUrl: process.env.NEXT_PUBLIC_SOURCE_OMNI_URL || '',
    token: process.env.SOURCE_OMNI_API_TOKEN || '',
  },
  target: {
    baseUrl: process.env.NEXT_PUBLIC_TARGET_OMNI_URL || '',
    token: process.env.TARGET_OMNI_API_TOKEN || '',
  },
} as const;

// Validation function to check if the configuration is complete
export function validateOmniConfig() {
  const missingVars = [];
  
  if (!OMNI_CONFIG.source.baseUrl) missingVars.push('NEXT_PUBLIC_SOURCE_OMNI_URL');
  if (!OMNI_CONFIG.source.token) missingVars.push('SOURCE_OMNI_API_TOKEN');
  if (!OMNI_CONFIG.target.baseUrl) missingVars.push('NEXT_PUBLIC_TARGET_OMNI_URL');
  if (!OMNI_CONFIG.target.token) missingVars.push('TARGET_OMNI_API_TOKEN');

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return true;
} 