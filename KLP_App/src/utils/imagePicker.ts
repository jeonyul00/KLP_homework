import ImageResizer from '@bam.tech/react-native-image-resizer';
import { launchImageLibrary } from 'react-native-image-picker';

export const pickProfileImage = async (): Promise<{ uri: string; name: string; type: string } | null> => {
  return new Promise((resolve, reject) => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async response => {
      const asset = response.assets?.[0];
      if (response.didCancel || !asset?.uri) {
        return resolve(null);
      }
      try {
        const mimeType = asset.type ?? 'image/jpeg';
        const originalFileName = asset.fileName ?? 'profile.jpg';
        const format = mimeType.includes('png') ? 'PNG' : 'JPEG';
        const resized = await ImageResizer.createResizedImage(asset.uri, 800, 800, format, 80, 0);
        const ext = format === 'PNG' ? 'png' : 'jpg';
        const filename = originalFileName.endsWith(`.${ext}`) ? originalFileName : `profile.${ext}`;
        resolve({
          uri: resized.uri,
          name: filename,
          type: format === 'PNG' ? 'image/png' : 'image/jpeg',
        });
      } catch (e) {
        reject('이미지 리사이즈 중 오류가 발생했습니다.');
      }
    });
  });
};

export const pickMultiplePostImages = async (max: number = 5): Promise<{ uri: string; name: string; type: string }[]> => {
  return new Promise((resolve, reject) => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: max }, async response => {
      const assets = response.assets;
      if (response.didCancel || !assets || assets.length === 0) {
        return resolve([]);
      }
      try {
        const resizedImages = await Promise.all(
          assets.map(async (asset, i) => {
            const mimeType = asset.type ?? 'image/jpeg';
            const originalFileName = asset.fileName ?? `image${i}.jpg`;
            const format = mimeType.includes('png') ? 'PNG' : 'JPEG';
            const resized = await ImageResizer.createResizedImage(asset.uri!, 800, 800, format, 80, 0);
            const ext = format === 'PNG' ? 'png' : 'jpg';
            const filename = originalFileName.endsWith(`.${ext}`) ? originalFileName : `image${i}.${ext}`;
            return { uri: resized.uri, name: filename, type: format === 'PNG' ? 'image/png' : 'image/jpeg' };
          }),
        );
        resolve(resizedImages);
      } catch (e) {
        reject('이미지 리사이즈 중 오류가 발생했습니다.');
      }
    });
  });
};
