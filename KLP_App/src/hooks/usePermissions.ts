import { useEffect, useState } from 'react';
import { Platform, AppState } from 'react-native';
import { check, Permission, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

type PermissionType = 'PHOTO';
type PermissionOS = {
  [key in PermissionType]: Permission;
};

const androidPermissions: PermissionOS = {
  PHOTO: Number(Platform.Version) >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

const iosPermissions: PermissionOS = {
  PHOTO: PERMISSIONS.IOS.PHOTO_LIBRARY,
};

export function usePermission(type: PermissionType): boolean {
  const [granted, setGranted] = useState<boolean | null>(null);

  const checkPermission = async () => {
    const isAndroid = Platform.OS === 'android';
    const permissionOS = isAndroid ? androidPermissions : iosPermissions;
    const checked = await check(permissionOS[type]);

    if (checked === RESULTS.GRANTED) {
      setGranted(true);
    } else if (checked === RESULTS.DENIED) {
      const requested = await request(permissionOS[type]);
      setGranted(requested === RESULTS.GRANTED);
    } else {
      setGranted(false);
    }
  };

  useEffect(() => {
    checkPermission();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  return granted ?? false;
}
