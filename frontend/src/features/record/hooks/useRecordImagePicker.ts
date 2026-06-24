import { useCallback, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import type { SelectedRecordImage } from '../types/upload.types';

const MAX_IMAGE_COUNT = 3;
const JPEG_CONTENT_TYPE = 'image/jpeg';
const JPEG_COMPRESS_QUALITY = 0.9;

async function convertAssetToJpeg(
  asset: ImagePicker.ImagePickerAsset,
  index: number,
): Promise<SelectedRecordImage> {
  const convertedImage = await ImageManipulator.manipulateAsync(
    asset.uri,
    [],
    {
      compress: JPEG_COMPRESS_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const fileNameBase = asset.fileName?.replace(/\.[^/.]+$/, '') ?? 'record';
  const fileName = `${fileNameBase}-${Date.now()}-${index}.jpg`;

  console.log('[record-image-picker] converted asset to jpeg', {
    originalUri: asset.uri,
    originalFileName: asset.fileName,
    originalMimeType: asset.mimeType,
    convertedUri: convertedImage.uri,
    fileName,
    contentType: JPEG_CONTENT_TYPE,
  });

  return {
    uri: convertedImage.uri,
    fileName,
    contentType: JPEG_CONTENT_TYPE,
  };
}

export function useRecordImagePicker() {
  const [images, setImages] = useState<SelectedRecordImage[]>([]);

  const pickImages = useCallback(async () => {
    if (images.length >= MAX_IMAGE_COUNT) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGE_COUNT - images.length,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    console.log(
      '[record-image-picker] selected assets',
      result.assets.map((asset) => ({
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
      })),
    );

    const pickedImages = await Promise.all(
      result.assets.map((asset, index) => convertAssetToJpeg(asset, index)),
    );

    setImages((prevImages) => [
      ...prevImages,
      ...pickedImages,
    ].slice(0, MAX_IMAGE_COUNT));
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index),
    );
  }, []);

  const resetImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    pickImages,
    removeImage,
    resetImages,
  };
}
