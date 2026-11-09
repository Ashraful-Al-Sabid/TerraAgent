// ==============================================================================
// TerraAgent Preset Applications (Demonstration Personas & Edge Cases)
// ==============================================================================

export const PRESET_APPLICATIONS = [
  {
    id: 'demo-app-001',
    label: 'Persona 1: Clean Mutation (Fast-track Approval)',
    badge: 'High Integrity (96%)',
    badgeColor: 'emerald',
    description: 'Sabid - Perfect NID, BRIS, & clean BS Khatian in Uttara, Dhaka.',
    data: {
      applicant_name_en: 'Md. Ashraful Al Sabid',
      applicant_name_bn: 'মো: আশরাফুল আল সাবিদ',
      nid_number: '19942692015000101',
      bris_number: '19942692015123456',
      dob: '1994-05-14',
      phone: '+8801712345678',
      email: 'ashrafulalsabid@gmail.com',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Uttara',
      mouza: 'Baunia',
      jl_number: '12',
      khatian_number: 'KH-4082',
      plot_number: 'PL-889',
      land_area_decimals: '5.50',
      application_type: 'mutation_namjari',
      documents: [
        {
          id: 'doc-1',
          doc_type: 'nid_card',
          file_name: 'NID_Ashraful_Al_Sabid.pdf',
          file_size: 420500,
          status: 'verified',
          extracted_data: {
            extracted_name_en: 'Md. Ashraful Al Sabid',
            extracted_name_bn: 'মো: আশরাফুল আল সাবিদ',
            extracted_nid: '19942692015000101',
            extracted_dob: '1994-05-14',
            ocr_confidence: 99.4
          }
        },
        {
          id: 'doc-2',
          doc_type: 'khatian_porcha',
          file_name: 'BS_Porcha_KH4082.pdf',
          file_size: 1048576,
          status: 'verified',
          extracted_data: {
            extracted_khatian: 'KH-4082',
            extracted_plot: 'PL-889',
            extracted_mouza: 'Baunia',
            recorded_owner: 'Md. Ashraful Al Sabid',
            ocr_confidence: 97.8
          }
        },
        {
          id: 'doc-3',
          doc_type: 'deed_dalil',
          file_name: 'Registered_Deed_3942_2018.pdf',
          file_size: 2097152,
          status: 'verified',
          extracted_data: {
            deed_number: '3942/2018',
            sub_registry_office: 'Uttara Sub-Registry',
            transferor: 'Al-Haj Mofizur Rahman',
            transferee: 'Md. Ashraful Al Sabid',
            ocr_confidence: 96.2
          }
        }
      ]
    }
  },
  {
    id: 'demo-app-002',
    label: 'Persona 2: Spelling Mismatch (Triggers Correction Flow)',
    badge: 'Discrepancy Flagged',
    badgeColor: 'amber',
    description: 'Tanvir vs Tanveer / আহমদ vs আহমেদ. Flags discrepancy for citizen review.',
    data: {
      applicant_name_en: 'Tanveer Ahmad Shanto', // Intentional variation from NID 'Tanvir Ahmed Shanto'
      applicant_name_bn: 'তানভীর আহমেদ শান্ত',
      nid_number: '19914712015000404',
      bris_number: '19914712015456789',
      dob: '1991-09-12',
      phone: '+8801819876543',
      email: 'tanveer.shanto@example.com',
      division: 'Sylhet',
      district: 'Sylhet',
      upazila: 'Sylhet Sadar',
      mouza: 'Amberkhana',
      jl_number: '18',
      khatian_number: 'KH-5542',
      plot_number: 'PL-771',
      land_area_decimals: '8.20',
      application_type: 'mutation_namjari',
      documents: [
        {
          id: 'doc-1',
          doc_type: 'nid_card',
          file_name: 'NID_Tanvir_Ahmed.pdf',
          file_size: 380000,
          status: 'flagged',
          extracted_data: {
            extracted_name_en: 'Tanvir Ahmed Shanto',
            extracted_name_bn: 'তানভীর আহমেদ শান্ত',
            extracted_nid: '19914712015000404',
            extracted_dob: '1991-09-12',
            ocr_confidence: 98.2
          }
        },
        {
          id: 'doc-2',
          doc_type: 'khatian_porcha',
          file_name: 'Porcha_KH5542_Amberkhana.pdf',
          file_size: 890000,
          status: 'verified',
          extracted_data: {
            extracted_khatian: 'KH-5542',
            extracted_plot: 'PL-771',
            extracted_mouza: 'Amberkhana',
            ocr_confidence: 95.1
          }
        }
      ]
    }
  },
  {
    id: 'demo-app-003',
    label: 'Persona 3: Disputed Land / Court Injunction (High Risk)',
    badge: 'Injunction / Litigation Alert',
    badgeColor: 'rose',
    description: 'Joydebpur plot with active Title Suit stay order and unpaid taxes.',
    data: {
      applicant_name_en: 'Kazi Anowar Hossain',
      applicant_name_bn: 'কাজী আনোয়ার হোসেন',
      nid_number: '19751912015000303',
      bris_number: '19751912015345678',
      dob: '1975-03-08',
      phone: '+8801912345678',
      email: 'anowar.kazi@example.com',
      division: 'Dhaka',
      district: 'Gazipur',
      upazila: 'Gazipur Sadar',
      mouza: 'Joydebpur',
      jl_number: '05',
      khatian_number: 'KH-9921',
      plot_number: 'PL-102',
      land_area_decimals: '25.75',
      application_type: 'mutation_namjari',
      documents: [
        {
          id: 'doc-1',
          doc_type: 'nid_card',
          file_name: 'NID_Kazi_Anowar.pdf',
          file_size: 410000,
          status: 'verified',
          extracted_data: {
            extracted_name_en: 'Kazi Anowar Hossain',
            extracted_name_bn: 'কাজী আনোয়ার হোসেন',
            extracted_nid: '19751912015000303',
            extracted_dob: '1975-03-08',
            ocr_confidence: 98.9
          }
        },
        {
          id: 'doc-2',
          doc_type: 'khatian_porcha',
          file_name: 'Porcha_KH9921_Joydebpur.pdf',
          file_size: 920000,
          status: 'flagged',
          extracted_data: {
            extracted_khatian: 'KH-9921',
            extracted_plot: 'PL-102',
            ocr_confidence: 94.6
          }
        }
      ]
    }
  },
  {
    id: 'demo-app-004',
    label: 'Persona 4: Vested / Khas Land (Prohibited Mutation)',
    badge: 'Critical Violation',
    badgeColor: 'red',
    description: 'Mirpur plot classified as Government Vested Property (অর্পিত সম্পত্তি).',
    data: {
      applicant_name_en: 'Rehana Sultana Parvin',
      applicant_name_bn: 'রেহানা সুলতানা পারভীন',
      nid_number: '19821592015000505',
      bris_number: 'N/A',
      dob: '1982-12-05',
      phone: '+8801552345678',
      email: 'rehana.parvin@example.com',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Mirpur',
      mouza: 'Senpara Parbata',
      jl_number: '09',
      khatian_number: 'KH-6630',
      plot_number: 'PL-415',
      land_area_decimals: '18.50',
      application_type: 'mutation_namjari',
      documents: [
        {
          id: 'doc-1',
          doc_type: 'nid_card',
          file_name: 'NID_Rehana_Sultana.pdf',
          file_size: 430000,
          status: 'verified',
          extracted_data: {
            extracted_name_en: 'Rehana Sultana Parvin',
            extracted_name_bn: 'রেহানা সুলতানা পারভীন',
            extracted_nid: '19821592015000505',
            extracted_dob: '1982-12-05',
            ocr_confidence: 97.4
          }
        }
      ]
    }
  }
];
