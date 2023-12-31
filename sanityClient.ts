import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient } from 'next-sanity';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(config);

/**
 * https://www.sanity.io/docs/image-url
 */
export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);
