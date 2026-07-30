export const CAR_IMAGE_MAP: Record<string, string> = {
  'swift': '/images/cars/swift.jpg',
  'tiago ev': '/images/cars/tiago_ev.jpg',
  'i20': '/images/cars/i20.jpg',
  'nexon': '/images/cars/nexon.jpg',
  'nexon ev': '/images/cars/nexon_ev.jpg',
  'creta': '/images/cars/creta.jpg',
  'seltos': '/images/cars/seltos.jpg',
  'xuv700': '/images/cars/xuv700.jpg',
  'city': '/images/cars/city.jpg',
  'verna': '/images/cars/verna.jpg',
  'dzire': '/images/cars/dzire.jpg',
  'ertiga': '/images/cars/ertiga.jpg',
  'innova hycross': '/images/cars/innova_hycross.jpg',
  'fortuner': '/images/cars/fortuner.jpg',
  'punch': '/images/cars/punch.jpg',
  'zs ev': '/images/cars/zs_ev.jpg',
  '3 series gran limousine': '/images/cars/3_series_gran_limousine.jpg',
};

/**
 * Normalizes a car name and retrieves its corresponding accurate local image URL.
 * Automatically ignores obsolete external unsplash stock photos.
 */
export function getCarActualImage(carName: string, dbImage?: string | null): string {
  if (dbImage && !dbImage.includes('unsplash.com')) {
    return dbImage;
  }
  if (!carName) return '/images/cars/nexon.jpg';

  const normalized = carName.toLowerCase()
    .replace('tata ', '')
    .replace('maruti suzuki ', '')
    .replace('maruti ', '')
    .replace('hyundai ', '')
    .replace('kia ', '')
    .replace('mahindra ', '')
    .replace('honda ', '')
    .replace('toyota ', '')
    .replace('mg ', '')
    .replace('bmw ', '')
    .trim();

  if (CAR_IMAGE_MAP[normalized]) {
    return CAR_IMAGE_MAP[normalized];
  }

  for (const [key, value] of Object.entries(CAR_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return '/images/cars/nexon.jpg';
}

/**
 * Direct raw image URL resolver for a car name.
 */
export function getCarRawUrl(carName: string, dbImage?: string | null): string {
  return getCarActualImage(carName, dbImage);
}
