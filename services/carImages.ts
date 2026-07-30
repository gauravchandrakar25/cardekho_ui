export const CAR_IMAGE_MAP: Record<string, string> = {
  'swift': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  'tiago ev': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
  'i20': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
  'nexon': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  'nexon ev': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  'creta': 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'seltos': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
  'xuv700': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'city': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'verna': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  'dzire': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
  'ertiga': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
  'innova hycross': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  'fortuner': 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80',
  'punch': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
  'zs ev': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  '3 series gran limousine': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
};


/**
 * Normalizes a car name and retrieves its corresponding real-world internet image URL.
 * Wraps the URL in images.weserv.nl proxy to bypass referer blocks and CORS policies.
 */
export function getCarActualImage(carName: string, dbImage?: string | null): string {
  let rawUrl = dbImage || CAR_IMAGE_MAP['nexon'];
  
  if (!dbImage && carName) {
    const normalized = carName.toLowerCase()
      .replace('tata ', '')
      .replace('maruti suzuki ', '')
      .replace('hyundai ', '')
      .replace('kia ', '')
      .replace('mahindra ', '')
      .replace('honda ', '')
      .replace('toyota ', '')
      .replace('mg ', '')
      .replace('bmw ', '')
      .trim();
    
    // 1. Direct match check
    if (CAR_IMAGE_MAP[normalized]) {
      rawUrl = CAR_IMAGE_MAP[normalized];
    } else {
      // 2. Substring match check
      for (const [key, value] of Object.entries(CAR_IMAGE_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          rawUrl = value;
          break;
        }
      }
    }
  }

  // Wrap in Weserv proxy to guarantee image delivery and remove referer headers
  return `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=800&fit=cover`;
}

/**
 * Retrieves the direct raw image URL for a car name without any proxy layer.
 */
export function getCarRawUrl(carName: string, dbImage?: string | null): string {
  if (dbImage) return dbImage;
  if (!carName) return CAR_IMAGE_MAP['nexon'];
  
  const normalized = carName.toLowerCase()
    .replace('tata ', '')
    .replace('maruti suzuki ', '')
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

  return CAR_IMAGE_MAP['nexon'];
}

