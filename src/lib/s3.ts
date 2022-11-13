import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';

const BUCKET_NAME = 'actopus-storage';
const s3 = new S3Client({
  endpoint: import.meta.env.VITE_S3_URL,
  region: 'auto',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET,
  },
});

export const getList = async () => {
  return await s3.send(new ListObjectsV2Command({ Bucket: 'actopus-storage' }));
};

const corsHeaders = {
  'Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Max-Age': '86400',
};

export const uploadFile = async (file: File, key: string) => {
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  }), { expiresIn: 3600 });
  await axios.put(url, file, { headers: corsHeaders });
  return true;
};

export const getFileUrl = async (key: string) => {
  return await getSignedUrl(s3, new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  }), { expiresIn: 3600 });
};

export default s3;
