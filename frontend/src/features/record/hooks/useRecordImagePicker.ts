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

  return {
    uri: convertedImage.uri,
    fileName,
    contentType: JPEG_CONTENT_TYPE,
  };
}

export function useRecordImagePicker() {
  const [images, setImages] = useState<SelectedRecordImage[]>([]);

  const pickImagesFromLibrary = useCallback(async (
    limit = MAX_IMAGE_COUNT,
  ): Promise<SelectedRecordImage[]> => {
    if (limit <= 0) {
      return [];
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: limit,
      quality: 0.9,
    });

    if (result.canceled) {
      return [];
    }
    return Promise.all(
      result.assets.map((asset, index) => convertAssetToJpeg(asset, index)),
    );
  }, []);

  const pickImages = useCallback(async () => {
    if (images.length >= MAX_IMAGE_COUNT) {
      return;
    }

    const pickedImages = await pickImagesFromLibrary(
      MAX_IMAGE_COUNT - images.length,
    );

    setImages((prevImages) => [
      ...prevImages,
      ...pickedImages,
    ].slice(0, MAX_IMAGE_COUNT));
  }, [images.length, pickImagesFromLibrary]);

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
    pickImagesFromLibrary,
    removeImage,
    resetImages,
  };
}
