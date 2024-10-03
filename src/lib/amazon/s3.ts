import { NextResponse } from 'next/server';
import s3 from './aws-config'
import { CreateMultipartUploadCommand, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { fetchCard } from '../database/cardService';

const BUCKET = process.env.AWS_S3_BUCKET || '';

// Function to extract the S3 key from the CloudFront URL
const getS3KeyFromUrl = (cloudFrontUrl?: string): string | undefined => {
    if (!cloudFrontUrl) {
      return undefined;
    }
    const url = new URL(cloudFrontUrl);
    return url.pathname.substring(1); // Remove the leading '/' from the path
  };
  
async function listObjectsInSubdirectory(bucket: string, prefix: string): Promise<string[]> {
  const params = {
      Bucket: bucket,
      Prefix: prefix,
  };

  try {
      const data = await s3.send(new ListObjectsV2Command(params));
      return data.Contents?.map((item) => item.Key || '') || [];
  } catch (error) {
      console.error('Error listing objects:', error);
      return [];
  }
}

// Function to delete objects in the S3 bucket
async function deleteObjects(bucket: string, keys: string[]): Promise<number> {
  if (keys.length === 0) {
      console.log('No objects to delete.');
      return 0;
  }

  const params = {
      Bucket: bucket,
      Delete: {
          Objects: keys.map((key) => ({ Key: key })),
      },
  };

  try {
      const data = await s3.send(new DeleteObjectsCommand(params));
      console.log('Delete objects response:', data);
      return data.Deleted?.length || 0;
  } catch (error) {
      console.error('Error deleting objects:', error);
  }
  return 0
}

export const deleteAllMediaFromS3 = async (id: string): Promise<number> => {
  const card = await fetchCard(id);  
  const excludeKeys = [getS3KeyFromUrl(card.imageUrl), getS3KeyFromUrl(card.videoUrl), getS3KeyFromUrl(card.backImageUrl), getS3KeyFromUrl(card.qrCodeUrl), getS3KeyFromUrl(card.temporaryImageUrl)]
  
  const keysToDelete = await listObjectsInSubdirectory(BUCKET, `${id}`);
  console.log(keysToDelete.length)
  const filteredKeysToDelete = keysToDelete.filter(k => !excludeKeys.includes(k))
  console.log(filteredKeysToDelete.length)
  const numDeleted = await deleteObjects(BUCKET, filteredKeysToDelete);

  return numDeleted

}

export const deleteMediaFromS3 = async (id: string, mediaType: 'image' | 'temp' | 'video' | 'back'): Promise<number> => {  
  const keysToDelete = await listObjectsInSubdirectory(BUCKET, `${id}/${mediaType}`);

  const numDeleted = await deleteObjects(BUCKET, keysToDelete);

  return numDeleted
}

export const beginMultipartUpload = async (id: string, filename: string, mediaType: 'back' | 'image' | 'temp' | 'video' | 'qrcode'): Promise<[string | undefined, string]> => {
  const parts: string[] = filename.split('.')
  const ext = parts[parts.length - 1]

  if (!ext) {
      throw new Error("Filename missing extension");
  }
  let key: string;
  key = `${id}/${mediaType}-${Date.now()}.${ext.toLowerCase()}`
  
  const command = new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key: key
  })
  const response = await s3.send(command);
  return [response.UploadId, key]
}
