import { createClient } from '@sanity/client';
import { AppContent } from '../types';

// Configuration
const cleanString = (str: any) => {
  if (!str || typeof str !== 'string') return '';
  // Remove ALL non-printable and non-ASCII characters to prevent encoding errors
  return str.replace(/[^\x20-\x7E]/g, '').trim();
};

const projectId = cleanString(import.meta.env.VITE_SANITY_PROJECT_ID);
const dataset = cleanString(import.meta.env.VITE_SANITY_DATASET) || 'production';
const token = cleanString(import.meta.env.VITE_SANITY_TOKEN);

export const sanityClient = projectId ? createClient({
  projectId: projectId,
  dataset: dataset,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: token || undefined,
  // Explicitly set the API host with protocol to prevent "not a valid URL" errors
  apiHost: `https://${projectId}.api.sanity.io`,
  useProjectHostname: false,
}) : null;

// Save content to Sanity
export const saveContentToSanity = async (content: AppContent) => {
  if (!sanityClient) {
    console.warn('Sanity Project ID missing. Skipping save.');
    return;
  }
  
  if (!token) {
    console.warn('Sanity Token missing. Mutations (saving) will fail.');
    return;
  }

  try {
    await sanityClient.createOrReplace({
      _id: 'siteContent',
      _type: 'siteContent',
      ...content
    });
    console.log('Content saved to Sanity successfully');
  } catch (error: any) {
    console.error('Sanity Save Error:', error);
    // Provide helpful guidance for common network/CORS issues
    if (error.message?.includes('Network Error') || error.name === 'TypeError') {
      console.error('POSSIBLE CAUSE: CORS settings in Sanity. Please add this domain to your Sanity project CORS origins at manage.sanity.io');
    }
  }
};

// Load content from Sanity
export const loadContentFromSanity = async (): Promise<AppContent | null> => {
  if (!sanityClient) {
    console.warn('Sanity Project ID missing. Skipping load.');
    return null;
  }

  try {
    const data = await sanityClient.fetch(`*[_id == "siteContent"][0]`);
    if (data) {
      const { _id, _type, _createdAt, _updatedAt, _rev, ...content } = data;
      return content as AppContent;
    }
    return null;
  } catch (error: any) {
    console.error('Sanity Load Error:', error);
    if (error.message?.includes('Network Error') || error.name === 'TypeError') {
      console.error('POSSIBLE CAUSE: CORS settings in Sanity. Please add this domain to your Sanity project CORS origins at manage.sanity.io');
    }
    return null;
  }
};
