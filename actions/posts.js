'use server';

import { uploadImage } from '@/lib/cloudinary';
import { storePost } from '@/lib/posts';
import { redirect } from 'next/navigation';

export async function createPost(prevState, formData) {
  'use server';
  const title = formData.get('title');
  const image = formData.get('image');
  const content = formData.get('content');

  const error = [];

  if (!title || title.trim().length === 0) {
    error.push('Title is required');
  }

  if (!content || content.trim().length === 0) {
    error.push('Content is required');
  }

  if (!image || image.size === 0) {
    error.push('Image is required');
  }

  if (error.length > 0) {
    return {
      errors: error,
    };
  }
  let imageUrl = '';
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error('Image upload failed: ' + error);
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });

  redirect('/feed');
}
