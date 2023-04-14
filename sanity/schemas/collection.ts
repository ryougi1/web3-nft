import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      description: 'Title of the NFT drop',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      description: 'Description of the NFT drop',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'nftCollectionName',
      title: 'Name of NFT Collection',
      type: 'string',
    }),
    defineField({
      name: 'smartContractAddress',
      title: 'Smart Contract Address',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'creator',
      title: 'Creator',
      type: 'reference',
      to: {type: 'creator'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'previewImage',
      title: 'Preview image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
