import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

const DESCRIPTIONS = {
  'kerala-6-days': {
    alt: 'Traditional houseboat gliding through the tranquil palm-fringed backwaters of Kerala',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Kerala_backwaters,_Houseboats,_India.jpg'
  },
  'unseen-kerala-with-wayanad-6-days': {
    alt: 'Lush green tea gardens and mist-covered mountain slopes in Wayanad, Kerala',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:View_atop_chembra_peak.jpg'
  },
  'kerala-with-kanyakumari-rameswaram-madurai-10-days': {
    alt: 'The iconic Vivekananda Rock Memorial surrounded by the Indian Ocean in Kanyakumari',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Vivekananda_rock_Memorial_and_Thiruvalluvar_Statue.jpg'
  },
  'manali-amritsar-6-days': {
    alt: 'The magnificent Golden Temple (Harmandir Sahib) illuminated over the sacred pool in Amritsar',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Golden_Temple,_Amritsar_03.jpg'
  },
  'kashmir-7-days': {
    alt: 'Snow-capped Himalayan peaks and alpine meadows in Gulmarg, Kashmir',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Devi_Temple,_Gulmarg,_Jammu_and_Kashmir.jpg'
  },
  'nainital-kausani-jim-corbett-8-days': {
    alt: 'The sparkling crescent-shaped Naini Lake surrounded by forested Himalayan hills in Nainital',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Nainitaalriv.jpg'
  },
  'three-sisters-of-northeast-india-10-days': {
    alt: 'The dramatic Nohkalikai waterfall plunging into an emerald pool in Cherrapunji, Meghalaya',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Nohkalikai_falls,Cherrapunji,Meghalaya_2.jpg'
  },
  'odisha-7-days': {
    alt: 'Intricately carved 13th-century stone chariot wheel at the Sun Temple in Konark, Odisha',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Closeup_of_the_center_of_a_stone_wheel_-_Konark_Sun_Temple,_Orissa,_India.jpg'
  },
  'odisha-with-gangasagar-10-days': {
    alt: 'The sacred 12th-century Jagannath Temple towering over Puri in Odisha',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Lord_Jagannath_temple_at_night.jpg'
  },
  'hyderabad-srisailam-5-days': {
    alt: 'The historic Charminar monument beautifully illuminated in Hyderabad',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_2023.jpg'
  },
  'goa-5-days': {
    alt: 'Crescent-shaped sandy shores and leaning coconut palms at Palolem Beach, Goa',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Palolem_Beach_South_Goa_-_panoramio.jpg'
  },
  'gujarat-8-days': {
    alt: 'The vast white salt expanse of the Great Rann of Kutch stretching to the horizon in Gujarat',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Rann_of_Kutch_-_White_Desert.jpg'
  },
  'dharamshala-dalhousie-amritsar-7-days': {
    alt: 'Majestic snow-clad Dhauladhar mountain range rising behind Dharamshala in Himachal Pradesh',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Dhauladhar_alpenglow_above_Dharamshala,_India.jpg'
  },
  'full-rajasthan-12-days': {
    alt: 'The iconic five-story pink sandstone honeycomb facade of Hawa Mahal in Jaipur, Rajasthan',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Hawa_Mahal_(The_Palace_of_Winds)_in_Jaipur,_20191218_1201_9174.jpg'
  },
  'mini-rajasthan-7-days': {
    alt: 'The grand Amber Fort and its ancient ramparts reflected in Maota Lake, Jaipur',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Jaigarh_Fort_overlooking_the_Amer_Fort_and_Maota_Lake.jpg'
  },
  'indore-ujjain-omkareshwar-5-days': {
    alt: 'The sacred Omkareshwar Jyotirlinga temple standing beside the Narmada River in Madhya Pradesh',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Omkareshwar_Narmada_River.jpg'
  },
  'bangalore-mysore-coorg-7-days': {
    alt: 'The royal Mysore Palace brilliantly illuminated with thousands of golden lights at night',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Mysuru_Palace_-_Night_View.jpg'
  },
  'spiti-valley-8-days': {
    alt: 'The ancient Tibetan Key Monastery perched high on a rugged mountain hill in Spiti Valley',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Key_Monastery,_Spiti_Valley_footloosedev.jpg'
  },
  'leh-ladakh-with-kargil-drass-turtuk-10-days': {
    alt: 'The colossal Maitreya Buddha statue and monastery overlooking the vast Nubra Valley in Ladakh',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Maitreya_Buddha_statue_Diskit_Monastery_Nubra_Ladakh.jpg'
  },
  'coastal-karnataka-8-days': {
    alt: 'The monumental statue of Lord Shiva towering over the Arabian Sea at Murudeshwar, Karnataka',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Murudeshwara_Temple_Shiva_-_Closer_Click.jpg'
  },
  'tamil-nadu-8-days': {
    alt: 'Towering colorful sculpted gopurams of the historic Meenakshi Amman Temple in Madurai',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Tower_of_Meenakshi_amman_temple.jpg'
  },
  'lakshadweep-6-days': {
    alt: 'Pristine white sand beaches and crystal turquoise lagoon at Bangaram Island, Lakshadweep',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Prime_Minister_of_Bharat,_Shri_Narendra_Damodardas_Modi_at_pristine_beautiful_beaches_at_Bangaram,_in_Lakshadweep.jpg'
  },
  'kodaikanal-ooty-6-days': {
    alt: 'Rolling emerald green tea plantations across the misty Nilgiri hills in Ooty',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Tea_Monarch_Aramby_Ooty_Nilgiris_Mar21_A7C_00293.jpg'
  },
  'russia-7-days': {
    alt: 'The world-famous colorful onion domes of Saint Basil’s Cathedral on Red Square in Moscow',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Sant_Vasily_cathedral_in_Moscow.JPG'
  },
  'thailand-malaysia-singapore-8-days': {
    alt: 'The iconic Marina Bay Sands and Singapore skyline glittering across the water',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:ArtScience_Museum,_Marina_Bay_Sands,_Singapore.jpg'
  },
  'baku-azerbaijan-5-days': {
    alt: 'The futuristic Flame Towers rising above the Baku city skyline along the Caspian Sea',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Flame_towers_from_Baku_boulevard.JPG'
  },
  'south-africa-8-days': {
    alt: 'Panoramic view of Table Mountain and the Atlantic coastline in Cape Town, South Africa',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Cape_Town_(ZA),_Table_Mountain_--_2024_--_2821.jpg'
  },
  'vietnam-7-days': {
    alt: 'Dramatic limestone karst pillars and emerald waters of UNESCO World Heritage Ha Long Bay, Vietnam',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ha_Long_Bay,_Vietnam,_Islands.jpg'
  },
  'singapore-malaysia-6-days': {
    alt: 'The soaring Petronas Twin Towers glowing against the evening sky in Kuala Lumpur, Malaysia',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Petronas_Towers_at_Night_-_from_the_base_upwards.jpg'
  },
  'exotic-thailand-6-days': {
    alt: 'Towering limestone cliffs sheltering the turquoise lagoon of Maya Bay, Phi Phi Islands, Thailand',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Playa_Maya,_Ko_Phi_Phi,_Tailandia,_2013-08-19,_DD_03.JPG'
  },
  'hampi-badami-vijayapura-6-days': {
    alt: 'The intricately sculpted Stone Chariot at Vijaya Vittala Temple in UNESCO World Heritage Hampi',
    author: 'Wikimedia Commons contributor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Iconic_Stone_Chariot_@_Vittala_Temple,_Hampi,_Karnataka.jpg'
  }
};

async function syncAll() {
  const photosPath = 'src/data/tour-photos.json';
  const existingPhotos = JSON.parse(await readFile(photosPath, 'utf8'));
  const files = readdirSync('public/assets/images/tours').filter(f => f.endsWith('.webp'));

  for (const f of files) {
    const slug = f.replace('.webp', '');
    const meta = DESCRIPTIONS[slug];
    const filePath = `public/assets/images/tours/${f}`;
    const info = await sharp(filePath).metadata();
    const existingIndex = existingPhotos.findIndex(p => p.slug === slug);

    if (existingIndex >= 0) {
      existingPhotos[existingIndex].width = info.width;
      existingPhotos[existingIndex].height = info.height;
    } else if (meta) {
      existingPhotos.push({
        slug,
        src: `/assets/images/tours/${f}`,
        width: info.width,
        height: info.height,
        alt: meta.alt,
        author: meta.author,
        license: meta.license,
        licenseUrl: meta.licenseUrl,
        source: meta.source,
        changes: 'Resized and optimized to high-resolution WebP.'
      });
    }
  }

  await writeFile(photosPath, JSON.stringify(existingPhotos, null, 2) + '\n', 'utf8');
  console.log(`Synchronized! Total photos in ${photosPath}: ${existingPhotos.length}`);
}

syncAll().catch(console.error);
