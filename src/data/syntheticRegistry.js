// ==============================================================================
// TerraAgent Synthetic Government Records Registry
// (Pre-seeded dataset representing Bangladesh NID, BRIS, & Land Ministry DLRS)
// ==============================================================================

export const SYNTHETIC_NID_REGISTRY = [
  {
    nid_number: '19942692015000101',
    name_en: 'Md. Ashraful Al Sabid',
    name_bn: 'মো: আশরাফুল আল সাবিদ',
    father_name_en: 'Abdul Mannan',
    father_name_bn: 'আব্দুল মান্নান',
    mother_name_en: 'Salma Begum',
    mother_name_bn: 'সালমা বেগম',
    dob: '1994-05-14',
    blood_group: 'A+',
    address: 'House 42, Road 7, Sector 4, Uttara, Dhaka-1230',
    status: 'ACTIVE'
  },
  {
    nid_number: '19882692015000202',
    name_en: 'Tahsina Rahman Chowdhury',
    name_bn: 'তাহসিনা রহমান চৌধুরী',
    father_name_en: 'Kamal Uddin Chowdhury',
    father_name_bn: 'কামাল উদ্দিন চৌধুরী',
    mother_name_en: 'Nurjahan Akter',
    mother_name_bn: 'নুরজাহান আক্তার',
    dob: '1988-11-20',
    blood_group: 'O+',
    address: 'Plot 15, Block B, Bashundhara R/A, Dhaka-1229',
    status: 'ACTIVE'
  },
  {
    nid_number: '19751912015000303',
    name_en: 'Kazi Anowar Hossain',
    name_bn: 'কাজী আনোয়ার হোসেন',
    father_name_en: 'Kazi Mozammel Hossain',
    father_name_bn: 'কাজী মোজাম্মেল হোসেন',
    mother_name_en: 'Amena Khatun',
    mother_name_bn: 'আমেনা খাতুন',
    dob: '1975-03-08',
    blood_group: 'B+',
    address: 'Vill: Joydebpur, Upazila: Gazipur Sadar, Gazipur',
    status: 'ACTIVE'
  },
  {
    nid_number: '19914712015000404',
    name_en: 'Tanvir Ahmed Shanto',
    name_bn: 'তানভীর আহমেদ শান্ত',
    father_name_en: 'Rafiqul Islam',
    father_name_bn: 'রফিকুল ইসলাম',
    mother_name_en: 'Rokeya Begum',
    mother_name_bn: 'রোকেয়া বেগম',
    dob: '1991-09-12',
    blood_group: 'AB+',
    address: 'Amberkhana, Sylhet Sadar, Sylhet-3100',
    status: 'ACTIVE'
  },
  {
    nid_number: '19821592015000505',
    name_en: 'Rehana Sultana Parvin',
    name_bn: 'রেহানা সুলতana পারভীন',
    father_name_en: 'Golam Mostafa',
    father_name_bn: 'গোলাম মোস্তফা',
    mother_name_en: 'Jahanara Begum',
    mother_name_bn: 'জাহানারা বেগম',
    dob: '1982-12-05',
    blood_group: 'O-',
    address: 'Pahartali, Chittagong',
    status: 'ACTIVE'
  }
];

export const SYNTHETIC_BRIS_REGISTRY = [
  {
    bris_number: '19942692015123456',
    name_en: 'Md. Ashraful Al Sabid',
    name_bn: 'মো: আশরাফুল আল সাবিদ',
    dob: '1994-05-14',
    birth_place: 'Dhaka',
    father_name_en: 'Abdul Mannan',
    mother_name_en: 'Salma Begum'
  },
  {
    bris_number: '19882692015234567',
    name_en: 'Tahsina Rahman Chowdhury',
    name_bn: 'তাহসিনা রহমান চৌধুরী',
    dob: '1988-11-20',
    birth_place: 'Chittagong',
    father_name_en: 'Kamal Uddin Chowdhury',
    mother_name_en: 'Nurjahan Akter'
  },
  {
    bris_number: '19751912015345678',
    name_en: 'Kazi Anwar Hossain', // Slight common spelling variant
    name_bn: 'কাজী আনোয়ার হোসেন',
    dob: '1975-03-08',
    birth_place: 'Gazipur',
    father_name_en: 'Kazi Mozammel Hossain',
    mother_name_en: 'Amena Khatun'
  },
  {
    bris_number: '19914712015456789',
    name_en: 'Tanveer Ahmed Shanto', // Slight vowel spelling variant
    name_bn: 'তানভীর আহমদ শান্ত',
    dob: '1991-09-12',
    birth_place: 'Sylhet',
    father_name_en: 'Rafiqul Islam',
    mother_name_en: 'Rokeya Begum'
  }
];

export const SYNTHETIC_LAND_REGISTRY = [
  {
    district: 'Dhaka',
    upazila: 'Uttara',
    mouza: 'Baunia',
    jl_number: '12',
    khatian_number: 'KH-4082',
    plot_number: 'PL-889',
    recorded_owner_en: 'Md. Ashraful Al Sabid',
    recorded_owner_bn: 'মো: আশরাফুল আল সাবিদ',
    recorded_nid: '19942692015000101',
    land_type: 'Bari (ভিটা/বাড়ি)',
    area_decimals: 5.50,
    encumbrance_status: 'Clear',
    last_tax_year: 2025,
    survey_type: 'BS',
    legal_remarks: 'Chain of title verified from Deed 3942/2018. Up-to-date land tax (Dakhila) verified.'
  },
  {
    district: 'Dhaka',
    upazila: 'Tejgaon',
    mouza: 'Begunbari',
    jl_number: '28',
    khatian_number: 'KH-1120',
    plot_number: 'PL-304',
    recorded_owner_en: 'Tahsina Rahman Chowdhury',
    recorded_owner_bn: 'তাহসিনা রহমান চৌধুরী',
    recorded_nid: '19882692015000202',
    land_type: 'Nal (নাল)',
    area_decimals: 12.00,
    encumbrance_status: 'Clear',
    last_tax_year: 2024,
    survey_type: 'RS',
    legal_remarks: 'Inherited via registered Warishan partition deed 102/2015.'
  },
  {
    district: 'Gazipur',
    upazila: 'Gazipur Sadar',
    mouza: 'Joydebpur',
    jl_number: '05',
    khatian_number: 'KH-9921',
    plot_number: 'PL-102',
    recorded_owner_en: 'Kazi Anowar Hossain',
    recorded_owner_bn: 'কাজী আনোয়ার হোসেন',
    recorded_nid: '19751912015000303',
    land_type: 'Chala (চালা)',
    area_decimals: 25.75,
    encumbrance_status: 'Court Injunction / নিষেধাজ্ঞা (Title Suit 44/2023)',
    last_tax_year: 2021,
    survey_type: 'BS',
    legal_remarks: 'Pending litigation at Senior Assistant Judge Court, Gazipur. Stay order active.'
  },
  {
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    mouza: 'Amberkhana',
    jl_number: '18',
    khatian_number: 'KH-5542',
    plot_number: 'PL-771',
    recorded_owner_en: 'Tanvir Ahmed Shanto',
    recorded_owner_bn: 'তানভীর আহমেদ শান্ত',
    recorded_nid: '19914712015000404',
    land_type: 'Nal (নাল)',
    area_decimals: 8.20,
    encumbrance_status: 'Clear',
    last_tax_year: 2025,
    survey_type: 'BS',
    legal_remarks: 'Direct purchase from original RS recorded owner.'
  },
  {
    district: 'Dhaka',
    upazila: 'Mirpur',
    mouza: 'Senpara Parbata',
    jl_number: '09',
    khatian_number: 'KH-6630',
    plot_number: 'PL-415',
    recorded_owner_en: 'Government of Bangladesh (Khas)',
    recorded_owner_bn: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (খাস জমি)',
    recorded_nid: 'N/A',
    land_type: 'Vested / অর্পিত সম্পত্তি',
    area_decimals: 18.50,
    encumbrance_status: 'Vested Property / অর্পিত সম্পত্তি ("ক" তফসিল)',
    last_tax_year: 2020,
    survey_type: 'CS',
    legal_remarks: 'Classified under Vested Property Return list Gazette. Prohibited from mutation.'
  }
];
