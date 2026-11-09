-- ==============================================================================
-- TerraAgent - Synthetic Government Records Seed Data
-- ==============================================================================

-- 1. Synthetic NID Records
INSERT INTO synthetic_nid_registry (nid_number, name_en, name_bn, father_name_en, father_name_bn, mother_name_en, mother_name_bn, dob, blood_group, address)
VALUES
('19942692015000101', 'Md. Ashraful Al Sabid', 'মো: আশরাফুল আল সাবিদ', 'Abdul Mannan', 'আব্দুল মান্নান', 'Salma Begum', 'সালমা বেগম', '1994-05-14', 'A+', 'House 42, Road 7, Sector 4, Uttara, Dhaka'),
('19882692015000202', 'Tahsina Rahman Chowdhury', 'তাহসিনা রহমান চৌধুরী', 'Kamal Uddin Chowdhury', 'কামাল উদ্দিন চৌধুরী', 'Nurjahan Akter', 'নুরজাহান আক্তার', '1988-11-20', 'O+', 'Plot 15, Block B, Bashundhara R/A, Dhaka'),
('19751912015000303', 'Kazi Anowar Hossain', 'কাজী আনোয়ার হোসেন', 'Kazi Mozammel Hossain', 'কাজী মোজাম্মেল হোসেন', 'Amena Khatun', 'আমেনা খাতুন', '1975-03-08', 'B+', 'Vill: Joydebpur, Upazila: Gazipur Sadar, Gazipur'),
('19914712015000404', 'Tanvir Ahmed Shanto', 'তানভীর আহমেদ শান্ত', 'Rafiqul Islam', 'রফিকুল ইসলাম', 'Rokeya Begum', 'রোকেয়া বেগম', '1991-09-12', 'AB+', 'Amberkhana, Sylhet Sadar, Sylhet'),
('19821592015000505', 'Rehana Sultana Parvin', 'রেহানা সুলতানা পারভীন', 'Golam Mostafa', 'গোলাম মোস্তফা', 'Jahanara Begum', 'জাহানারা বেগম', '1982-12-05', 'O-', 'Pahartali, Chittagong');

-- 2. Synthetic BRIS (Birth Registration Information System)
INSERT INTO synthetic_birth_registry (bris_number, name_en, name_bn, dob, birth_place, registration_date, father_name_en, mother_name_en)
VALUES
('19942692015123456', 'Md. Ashraful Al Sabid', 'মো: আশরাফুল আল সাবিদ', '1994-05-14', 'Dhaka', '1994-06-01', 'Abdul Mannan', 'Salma Begum'),
('19882692015234567', 'Tahsina Rahman Chowdhury', 'তাহসিনা রহমান চৌধুরী', '1988-11-20', 'Chittagong', '1988-12-10', 'Kamal Uddin Chowdhury', 'Nurjahan Akter'),
('19751912015345678', 'Kazi Anwar Hossain', 'কাজী আনোয়ার হোসেন', '1975-03-08', 'Gazipur', '1975-04-15', 'Kazi Mozammel Hossain', 'Amena Khatun'),
('19914712015456789', 'Tanveer Ahmed Shanto', 'তানভীর আহমদ শান্ত', '1991-09-12', 'Sylhet', '1991-10-02', 'Rafiqul Islam', 'Rokeya Begum');

-- 3. Synthetic Land Records (Khatian / Porcha Registry)
INSERT INTO synthetic_land_registry (district, upazila, mouza, jl_number, khatian_number, plot_number, recorded_owner_en, recorded_owner_bn, recorded_nid, land_type, area_decimals, encumbrance_status, last_tax_year, survey_type)
VALUES
('Dhaka', 'Uttara', 'Baunia', '12', 'KH-4082', 'PL-889', 'Md. Ashraful Al Sabid', 'মো: আশরাফুল আল সাবিদ', '19942692015000101', 'Bari', 5.50, 'Clear', 2025, 'BS'),
('Dhaka', 'Tejgaon', 'Begunbari', '28', 'KH-1120', 'PL-304', 'Tahsina Rahman Chowdhury', 'তাহসিনা রহমান চৌধুরী', '19882692015000202', 'Nal', 12.00, 'Clear', 2024, 'RS'),
('Gazipur', 'Gazipur Sadar', 'Joydebpur', '05', 'KH-9921', 'PL-102', 'Kazi Anowar Hossain', 'কাজী আনোয়ার হোসেন', '19751912015000303', 'Chala', 25.75, 'Court Injunction / নিষেধাজ্ঞা (Title Suit 44/2023)', 2021, 'BS'),
('Sylhet', 'Sylhet Sadar', 'Amberkhana', '18', 'KH-5542', 'PL-771', 'Tanvir Ahmed Shanto', 'তানভীর আহমেদ শান্ত', '19914712015000404', 'Nal', 8.20, 'Clear', 2025, 'BS'),
('Dhaka', 'Mirpur', 'Senpara Parbata', '09', 'KH-6630', 'PL-415', 'Government of Bangladesh (Khas)', 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (খাস জমি)', 'N/A', 'Vested / অর্পিত', 18.50, 'Vested Property / অর্পিত সম্পত্তি (Cannot be Mutated)', 2020, 'CS');
