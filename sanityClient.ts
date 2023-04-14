import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
};

console.log('config:', config);

const client = createClient(config);
const builder = imageUrlBuilder(config);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export { client, urlFor };
