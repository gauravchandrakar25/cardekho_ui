// Real-world, high-quality public image URLs for every car model in the database from Wikimedia Commons.
export const CAR_IMAGE_MAP: Record<string, string> = {
  'swift': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/2018_Suzuki_Swift_SZ5_Boosterjet_SHVS_1.0_Front.jpg',
  'tiago ev': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Tata_Tiago_2020.jpg',
  'i20': 'https://upload.wikimedia.org/wikipedia/commons/6/69/2021_Hyundai_i20_N_Line_%28BI3%3B_India%29_front_view.png',
  'nexon': 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Tata_Nexon_XM.jpg',
  'nexon ev': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Tata_Nexon_EV_in_Hyderabad_02.jpg',
  'creta': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Hyundai_Creta_India.jpg',
  'seltos': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Kia_Seltos_SP2_PE_Snow_White_Pearl_%286%29_%28cropped%29.jpg',
  'xuv700': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mahindra_XUV700_AX7_Luxury_Pack_2021.jpg',
  'city': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view.jpg',
  'verna': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Hyundai_Verna_IV_facelift_001.jpg',
  'dzire': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Maruti_Suzuki_Dzire_VXi_VVT.JPG',
  'ertiga': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Suzuki_Ertiga%2C_MPV_front_view.jpg',
  'innova hycross': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Toyota_Innova_Zenix_2.0_Q_Hybrid_2023.jpg',
  'fortuner': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Toyota_Fortuner_4x2_Legender_2022_%281%29.jpg',
  'punch': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Tata_Punch_Creative_2021.jpg',
  'zs ev': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/2022_MG_ZS_EV_Standard_Range_Excite_front.jpg',
  '3 series gran limousine': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/BMW_3_Series_Gran_Limousine_330Li_Luxury_Line_2021.jpg',
};

/**
 * Normalizes a car name and retrieves its corresponding real-world internet image URL.
 * Wraps the URL in images.weserv.nl proxy to bypass referer blocks and CORS policies.
 */
export function getCarActualImage(carName: string): string {
  let rawUrl = CAR_IMAGE_MAP['nexon'];
  
  if (carName) {
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
export function getCarRawUrl(carName: string): string {
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
