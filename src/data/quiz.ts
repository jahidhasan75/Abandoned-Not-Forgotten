/**
 * The EXOARCHIVE quiz: 50 multiple-choice questions, every answer taken from the archive itself
 * (src/data/missionsData.ts). `ref` is the id of the artifact whose dossier holds the fact, so the
 * quiz can link the visitor to it.
 *
 * Each entry is [question, options, explanation]. The FIRST option is always the correct one;
 * the quiz shuffles the options before showing them.
 */
export interface QuizItem {
  id: string;
  ref: string;
  en: [string, [string, string, string, string], string];
  bn: [string, [string, string, string, string], string];
}

export const QUIZ_BANK: QuizItem[] = [
  // ---------- Sojourner ----------
  {
    id: 'q01', ref: 'sojourner',
    en: ['How much did the Sojourner rover weigh?', ['11.5 kg', '185 kg', '1.8 kg', '900 kg'],
      'Sojourner weighed only 11.5 kg, about the size of a microwave oven.'],
    bn: ['সোজার্নার রোভারের ওজন কত ছিল?', ['১১.৫ কেজি', '১৮৫ কেজি', '১.৮ কেজি', '৯০০ কেজি'],
      'সোজার্নারের ওজন ছিল মাত্র ১১.৫ কেজি, মোটামুটি একটি মাইক্রোওয়েভ ওভেনের সমান।'],
  },
  {
    id: 'q02', ref: 'sojourner',
    en: ['Sojourner was designed for 7 sols. How many sols did it actually work?', ['83', '7', '30', '1,000'],
      'It was designed for 7 Martian days and operated for 83.'],
    bn: ['সোজার্নার ৭ সলের জন্য তৈরি হয়েছিল। আসলে এটি কত সল কাজ করেছিল?', ['৮৩', '৭', '৩০', '১,০০০'],
      'মঙ্গলের ৭ দিনের জন্য তৈরি হলেও এটি ৮৩ দিন কাজ করেছিল।'],
  },
  {
    id: 'q03', ref: 'sojourner',
    en: ['Who was the Sojourner rover named after?', ['Sojourner Truth, the abolitionist and women’s rights activist', 'A Greek goddess of travel', 'The engineer who built it', 'A crater on Mars'],
      'It was named after Sojourner Truth, the African American abolitionist and women’s rights activist.'],
    bn: ['সোজার্নার রোভারের নাম কার নামে রাখা হয়েছিল?', ['দাসপ্রথাবিরোধী ও নারী অধিকারকর্মী সোজার্নার ট্রুথ', 'ভ্রমণের এক গ্রিক দেবী', 'যে প্রকৌশলী এটি বানিয়েছিলেন', 'মঙ্গলের একটি গর্ত'],
      'আফ্রিকান আমেরিকান দাসপ্রথাবিরোধী ও নারী অধিকারকর্মী সোজার্নার ট্রুথের নামে এর নাম রাখা হয়।'],
  },
  {
    id: 'q04', ref: 'sojourner',
    en: ['Sojourner pioneered a suspension later used by Spirit, Opportunity, Curiosity and Perseverance. What is it called?', ['Rocker-bogie', 'Caterpillar tracks', 'Walking legs', 'Air cushion'],
      'Sojourner pioneered the rocker-bogie suspension that carried every later NASA Mars rover.'],
    bn: ['সোজার্নার একটি সাসপেনশন প্রথম ব্যবহার করে, যা পরে স্পিরিট, অপারচুনিটি, কিউরিওসিটি ও পারসিভিয়ারেন্সে ব্যবহৃত হয়। এর নাম কী?', ['রকার-বোগি', 'ক্যাটারপিলার ট্র্যাক', 'হাঁটার পা', 'বাতাসের কুশন'],
      'সোজার্নারই প্রথম রকার-বোগি সাসপেনশন ব্যবহার করে, যা পরের সব নাসা মঙ্গল রোভারে ছিল।'],
  },
  // ---------- Opportunity ----------
  {
    id: 'q05', ref: 'opportunity',
    en: ['How far did the Opportunity rover drive on Mars?', ['45.16 km', '7.73 km', '600 m', '100 m'],
      'Opportunity covered 45.16 kilometres, about the length of a marathon.'],
    bn: ['অপারচুনিটি রোভার মঙ্গলে কত দূর চলেছিল?', ['৪৫.১৬ কিমি', '৭.৭৩ কিমি', '৬০০ মিটার', '১০০ মিটার'],
      'অপারচুনিটি ৪৫.১৬ কিলোমিটার চলেছিল, প্রায় একটি ম্যারাথনের দূরত্ব।'],
  },
  {
    id: 'q06', ref: 'opportunity',
    en: ['Opportunity was designed to last how many Martian days?', ['90', '7', '1,000', '5,111'],
      'It was designed for 90 Martian days and roamed Mars for more than 14 years.'],
    bn: ['অপারচুনিটি মঙ্গলের কত দিন টিকে থাকার জন্য তৈরি হয়েছিল?', ['৯০', '৭', '১,০০০', '৫,১১১'],
      'এটি ৯০ দিনের জন্য তৈরি হলেও ১৪ বছরের বেশি মঙ্গলে ঘুরেছে।'],
  },
  {
    id: 'q07', ref: 'opportunity',
    en: ['Opportunity found tiny round “blueberries” in the soil. What are they?', ['Hematite-rich mineral spherules', 'Frozen water droplets', 'Pieces of a meteorite', 'Seeds of a plant'],
      'The “blueberries” are hematite-rich mineral spherules, a clue that water once soaked the plains.'],
    bn: ['অপারচুনিটি মাটিতে ছোট গোল “ব্লুবেরি” খুঁজে পায়। এগুলো আসলে কী?', ['হেমাটাইট-সমৃদ্ধ খনিজ গোলক', 'জমে যাওয়া পানির ফোঁটা', 'উল্কাপিণ্ডের টুকরো', 'গাছের বীজ'],
      '“ব্লুবেরি” হলো হেমাটাইট-সমৃদ্ধ খনিজ গোলক, যা বলে যে একসময় ওই সমভূমি পানিতে ভেজা ছিল।'],
  },
  {
    id: 'q08', ref: 'opportunity',
    en: ['What is the most likely reason Opportunity fell silent in 2018?', ['A planet-wide dust storm covered it in dust', 'It got stuck in sand', 'A software command switched it off', 'It drove off a cliff'],
      'It is presumed blanketed in dust after the planet-encircling dust storm of 2018.'],
    bn: ['২০১৮ সালে অপারচুনিটি নীরব হয়ে যাওয়ার সবচেয়ে সম্ভাব্য কারণ কী?', ['গোটা গ্রহজুড়ে ধূলিঝড়ে এটি ধুলোয় ঢেকে যায়', 'বালিতে আটকে যায়', 'একটি সফটওয়্যার নির্দেশে বন্ধ হয়ে যায়', 'খাড়া পাড় থেকে পড়ে যায়'],
      'ধারণা করা হয়, ২০১৮ সালের গ্রহজোড়া ধূলিঝড়ে এটি ধুলোয় ঢেকে গিয়েছিল।'],
  },
  // ---------- Spirit ----------
  {
    id: 'q09', ref: 'spirit',
    en: ['Spirit’s broken wheel dragged through the soil and uncovered something important. What?', ['Nearly pure silica, a sign of ancient hot springs', 'Water ice', 'An iron meteorite', 'Orange volcanic glass'],
      'The dragging wheel exposed 90% pure silica, the signature of ancient volcanic hot springs.'],
    bn: ['স্পিরিটের ভাঙা চাকা মাটি ঘষে একটি গুরুত্বপূর্ণ জিনিস বের করে আনে। সেটা কী?', ['প্রায় খাঁটি সিলিকা, প্রাচীন উষ্ণ প্রস্রবণের চিহ্ন', 'বরফ', 'লোহার উল্কাপিণ্ড', 'কমলা আগ্নেয় কাচ'],
      'টেনে নেওয়া চাকায় ৯০% খাঁটি সিলিকা বেরিয়ে আসে, যা প্রাচীন আগ্নেয় উষ্ণ প্রস্রবণের চিহ্ন।'],
  },
  {
    id: 'q10', ref: 'spirit',
    en: ['Why did Spirit fall silent in 2010?', ['It was stuck in sand and could not tilt its solar panels to the winter Sun', 'A dust storm buried it', 'It ran out of fuel', 'NASA switched it off to save money'],
      'Trapped in loose sand at Troy, it could not tilt its solar panels towards the winter Sun.'],
    bn: ['২০১০ সালে স্পিরিট কেন নীরব হয়ে যায়?', ['বালিতে আটকে থাকায় শীতের সূর্যের দিকে সৌর প্যানেল কাত করতে পারেনি', 'ধূলিঝড়ে চাপা পড়ে', 'জ্বালানি ফুরিয়ে যায়', 'খরচ বাঁচাতে নাসা বন্ধ করে দেয়'],
      'ট্রয় নামের জায়গায় আলগা বালিতে আটকে থাকায় এটি শীতের সূর্যের দিকে প্যানেল ঘোরাতে পারেনি।'],
  },
  {
    id: 'q11', ref: 'spirit',
    en: ['In which crater did Spirit land?', ['Gusev Crater', 'Gale Crater', 'Jezero Crater', 'Endeavour Crater'],
      'Spirit landed in rugged Gusev Crater, on the opposite side of Mars from Opportunity.'],
    bn: ['স্পিরিট কোন গর্তে নেমেছিল?', ['গুসেভ গর্ত', 'গেইল গর্ত', 'জেজেরো গর্ত', 'এন্ডেভার গর্ত'],
      'স্পিরিট নেমেছিল এবড়োখেবড়ো গুসেভ গর্তে, অপারচুনিটির ঠিক উল্টো দিকে।'],
  },
  // ---------- Phoenix ----------
  {
    id: 'q12', ref: 'phoenix',
    en: ['What did Phoenix confirm for the first time by sampling it directly?', ['Water ice under the Martian soil', 'Living microbes', 'Liquid lakes', 'Oil deposits'],
      'Phoenix scraped trenches and exposed white patches that slowly vanished: water ice.'],
    bn: ['ফিনিক্স প্রথমবার সরাসরি নমুনা নিয়ে কী নিশ্চিত করেছিল?', ['মঙ্গলের মাটির নিচে বরফ', 'জীবন্ত অণুজীব', 'তরল হ্রদ', 'তেলের মজুদ'],
      'ফিনিক্স গর্ত খুঁড়ে সাদা ছোপ বের করে, যা ধীরে ধীরে মিলিয়ে যায়: সেটা ছিল বরফ।'],
  },
  {
    id: 'q13', ref: 'phoenix',
    en: ['Which salts did Phoenix discover in the Martian soil?', ['Perchlorates', 'Table salt only', 'Gold salts', 'None at all'],
      'Phoenix found perchlorate salts, an oxidiser and chemical energy source.'],
    bn: ['ফিনিক্স মঙ্গলের মাটিতে কোন লবণ খুঁজে পায়?', ['পারক্লোরেট', 'শুধু খাবার লবণ', 'সোনার লবণ', 'কোনো লবণই না'],
      'ফিনিক্স পারক্লোরেট লবণ খুঁজে পায়, যা একটি জারক ও রাসায়নিক শক্তির উৎস।'],
  },
  {
    id: 'q14', ref: 'phoenix',
    en: ['What ended Phoenix after its mission?', ['Carbon-dioxide ice in the northern winter crushed its solar panels', 'A meteorite strike', 'A failed landing', 'A dust devil knocked it over'],
      'During the northern winter, tons of carbon-dioxide ice crushed its solar panels.'],
    bn: ['মিশন শেষে ফিনিক্সকে কী থামিয়ে দেয়?', ['উত্তরের শীতে কার্বন ডাই-অক্সাইডের বরফ এর সৌর প্যানেল ভেঙে দেয়', 'উল্কার আঘাত', 'ব্যর্থ অবতরণ', 'ঘূর্ণি ধুলো একে উল্টে দেয়'],
      'উত্তরের শীতে টন টন কার্বন ডাই-অক্সাইডের বরফ এর সৌর প্যানেল চূর্ণ করে দেয়।'],
  },
  {
    id: 'q15', ref: 'phoenix',
    en: ['Using a laser, Phoenix saw what falling from Martian clouds?', ['Snow', 'Rain', 'Hail stones of rock', 'Nothing ever falls on Mars'],
      'Its LiDAR observed snow falling from Martian cirrus clouds.'],
    bn: ['লেজার দিয়ে ফিনিক্স মঙ্গলের মেঘ থেকে কী পড়তে দেখেছিল?', ['তুষার', 'বৃষ্টি', 'পাথরের শিলা', 'মঙ্গলে কিছুই পড়ে না'],
      'এর লাইডার মঙ্গলের পাতলা মেঘ থেকে তুষার পড়তে দেখেছিল।'],
  },
  // ---------- InSight ----------
  {
    id: 'q16', ref: 'insight',
    en: ['About how many marsquakes did InSight detect?', ['More than 1,300', 'About 50', 'None', 'More than 100,000'],
      'InSight detected over 1,318 marsquakes, up to magnitude 5.'],
    bn: ['ইনসাইট প্রায় কতগুলো মঙ্গলকম্পন শনাক্ত করেছিল?', ['১,৩০০-এর বেশি', 'প্রায় ৫০টি', 'একটিও না', '১,০০,০০০-এর বেশি'],
      'ইনসাইট ১,৩১৮টির বেশি মঙ্গলকম্পন শনাক্ত করে, সর্বোচ্চ মাত্রা ৫।'],
  },
  {
    id: 'q17', ref: 'insight',
    en: ['InSight measured the size of the Martian core. Roughly what is its radius?', ['About 1,830 km', 'About 18 km', 'About 18,300 km', 'Mars has no core'],
      'InSight determined the core’s size (about 1,830 km radius) and that it is liquid.'],
    bn: ['ইনসাইট মঙ্গলের কেন্দ্রের আকার মেপেছিল। এর ব্যাসার্ধ মোটামুটি কত?', ['প্রায় ১,৮৩০ কিমি', 'প্রায় ১৮ কিমি', 'প্রায় ১৮,৩০০ কিমি', 'মঙ্গলের কোনো কেন্দ্র নেই'],
      'ইনসাইট দেখায় কেন্দ্রের ব্যাসার্ধ প্রায় ১,৮৩০ কিমি এবং এটি তরল।'],
  },
  {
    id: 'q18', ref: 'insight',
    en: ['How did engineers squeeze extra months of life out of InSight?', ['They trickled sand into the wind so gusts blew dust off the panels', 'They sent a new battery', 'They moved it into the shade', 'They switched off the seismometer'],
      'They used the robotic scoop to trickle sand into the wind, which carried dust off the solar panels.'],
    bn: ['প্রকৌশলীরা কীভাবে ইনসাইটের আয়ু কয়েক মাস বাড়িয়েছিলেন?', ['বাতাসে বালি ছেড়ে দিয়ে, যাতে দমকা হাওয়া প্যানেলের ধুলো উড়িয়ে নেয়', 'নতুন ব্যাটারি পাঠিয়ে', 'ছায়ায় সরিয়ে নিয়ে', 'সিসমোমিটার বন্ধ করে'],
      'রোবটিক হাতার বালি বাতাসে ছাড়া হয়, আর হাওয়া সৌর প্যানেলের ধুলো উড়িয়ে নেয়।'],
  },
  {
    id: 'q19', ref: 'insight',
    en: ['What finally stopped InSight in 2022?', ['Dust building up on its solar panels', 'A marsquake toppled it', 'It ran out of nuclear fuel', 'A rover drove into it'],
      'Its solar power ran down as dust piled up over four years.'],
    bn: ['২০২২ সালে ইনসাইটকে শেষ পর্যন্ত কী থামায়?', ['সৌর প্যানেলে জমে ওঠা ধুলো', 'মঙ্গলকম্পনে উল্টে যাওয়া', 'পারমাণবিক জ্বালানি ফুরিয়ে যাওয়া', 'একটি রোভারের ধাক্কা'],
      'চার বছরে জমা ধুলোয় এর সৌরশক্তি ফুরিয়ে যায়।'],
  },
  // ---------- Viking ----------
  {
    id: 'q20', ref: 'viking1',
    en: ['In 1982 NASA renamed the Viking 1 lander. What is it now called?', ['Thomas A. Mutch Memorial Station', 'Carl Sagan Station', 'Plains of Gold Base', 'Chryse One'],
      'It became the Thomas A. Mutch Memorial Station, after the Viking imaging team leader.'],
    bn: ['১৯৮২ সালে নাসা ভাইকিং ১ ল্যান্ডারের নাম বদলায়। এখন এর নাম কী?', ['টমাস এ. মাচ মেমোরিয়াল স্টেশন', 'কার্ল সেগান স্টেশন', 'সোনার সমভূমি ঘাঁটি', 'ক্রাইস ওয়ান'],
      'ভাইকিং ইমেজিং দলের প্রধানের নামে এর নাম হয় টমাস এ. মাচ মেমোরিয়াল স্টেশন।'],
  },
  {
    id: 'q21', ref: 'viking1',
    en: ['How did Viking 1 lose contact with Earth?', ['A faulty software command overwrote its antenna-pointing program', 'A dust storm covered it', 'It sank into soft sand', 'Its parachute failed'],
      'An erroneous command overwrote the high-gain antenna pointing program.'],
    bn: ['ভাইকিং ১ কীভাবে পৃথিবীর সঙ্গে যোগাযোগ হারায়?', ['একটি ভুল সফটওয়্যার নির্দেশ এর অ্যান্টেনা তাক করার প্রোগ্রাম মুছে দেয়', 'ধূলিঝড়ে ঢেকে যায়', 'নরম বালিতে ডুবে যায়', 'প্যারাস্যুট কাজ করেনি'],
      'একটি ভুল নির্দেশ উচ্চ-ক্ষমতার অ্যান্টেনা তাক করার প্রোগ্রামটি মুছে দিয়েছিল।'],
  },
  {
    id: 'q22', ref: 'viking1',
    en: ['What powered the Viking landers through the dark Martian winters?', ['Radioisotope thermoelectric generators', 'Solar panels', 'Wind turbines', 'Batteries charged on Earth'],
      'Each lander carried two radioisotope generators for steady heat and electricity.'],
    bn: ['মঙ্গলের অন্ধকার শীতে ভাইকিং ল্যান্ডারগুলো কিসের শক্তিতে চলত?', ['রেডিওআইসোটোপ থার্মোইলেকট্রিক জেনারেটর', 'সৌর প্যানেল', 'বায়ুকল', 'পৃথিবীতে চার্জ করা ব্যাটারি'],
      'প্রতিটি ল্যান্ডারে দুটি রেডিওআইসোটোপ জেনারেটর ছিল, যা স্থির তাপ ও বিদ্যুৎ দিত।'],
  },
  {
    id: 'q23', ref: 'viking2',
    en: ['Viking 2 took one of the most famous pictures from Mars. What does it show?', ['A thin layer of water frost on the ground', 'A blue sunset', 'A dust devil', 'Earth in the sky'],
      'In the northern winter its cameras photographed water frost around the lander.'],
    bn: ['ভাইকিং ২ মঙ্গল থেকে সবচেয়ে বিখ্যাত ছবিগুলোর একটি তোলে। তাতে কী দেখা যায়?', ['মাটিতে পাতলা পানির তুষারকণা (ফ্রস্ট)', 'নীল সূর্যাস্ত', 'ঘূর্ণি ধুলো', 'আকাশে পৃথিবী'],
      'উত্তরের শীতে এর ক্যামেরা ল্যান্ডারের চারপাশে পানির ফ্রস্টের ছবি তোলে।'],
  },
  // ---------- Apollo 11 ----------
  {
    id: 'q24', ref: 'apollo11-descent',
    en: ['Why did Apollo 11 leave the Eagle’s descent stage on the Moon?', ['Leaving it behind cut the weight to lift off by about half', 'It was broken on landing', 'It was a gift for future visitors', 'It was too hot to touch'],
      'Staging: the descent stage served as the launch pad, and leaving it halved the ascent weight.'],
    bn: ['অ্যাপোলো ১১ কেন ঈগলের অবতরণ অংশটি চাঁদে রেখে আসে?', ['এটি রেখে আসায় ওড়ার ওজন প্রায় অর্ধেক কমে যায়', 'নামার সময় এটি ভেঙে গিয়েছিল', 'ভবিষ্যৎ অতিথিদের উপহার হিসেবে', 'এটি ছোঁয়ার মতো ঠান্ডা ছিল না'],
      'স্টেজিং: অবতরণ অংশটি উৎক্ষেপণ মঞ্চ হিসেবে কাজ করে, আর এটি রেখে আসায় ওজন অর্ধেক কমে।'],
  },
  {
    id: 'q25', ref: 'apollo11-descent',
    en: ['Neil Armstrong flew Eagle by hand for the last part of the landing. Why?', ['The computer was guiding them towards a boulder-strewn crater', 'The engine had stopped', 'Mission Control asked him to show off', 'The windows were covered in dust'],
      'He piloted manually for the final 60 seconds to avoid a crater full of boulders.'],
    bn: ['অবতরণের শেষ অংশে নিল আর্মস্ট্রং কেন নিজ হাতে ঈগল চালান?', ['কম্পিউটার তাঁদের বড় পাথরে ভরা একটি গর্তের দিকে নিয়ে যাচ্ছিল', 'ইঞ্জিন বন্ধ হয়ে গিয়েছিল', 'মিশন কন্ট্রোল তাঁকে দক্ষতা দেখাতে বলেছিল', 'জানালা ধুলোয় ঢেকে গিয়েছিল'],
      'বড় পাথরে ভরা গর্ত এড়াতে শেষ ৬০ সেকেন্ড তিনি নিজে চালান।'],
  },
  {
    id: 'q26', ref: 'apollo11-descent',
    en: ['How much Moon rock and soil did Apollo 11 bring back?', ['21.5 kg', '2.15 kg', '215 kg', '2,150 kg'],
      'Apollo 11 returned 21.5 kg of lunar rock and regolith.'],
    bn: ['অ্যাপোলো ১১ চাঁদের কতখানি পাথর ও মাটি নিয়ে আসে?', ['২১.৫ কেজি', '২.১৫ কেজি', '২১৫ কেজি', '২,১৫০ কেজি'],
      'অ্যাপোলো ১১ চাঁদের ২১.৫ কেজি পাথর ও মাটি নিয়ে আসে।'],
  },
  {
    id: 'q27', ref: 'apollo11-lrrr',
    en: ['The Apollo 11 laser reflector is still in use. How does it work?', ['Its prisms bounce laser pulses straight back to the telescope that sent them', 'It sends radio signals using solar power', 'It films the Earth', 'It measures moonquakes'],
      'Corner-cube prisms return light to its source; observatories time the echo.'],
    bn: ['অ্যাপোলো ১১-এর লেজার প্রতিফলক এখনো ব্যবহার হয়। এটি কীভাবে কাজ করে?', ['এর প্রিজম লেজার রশ্মি ঠিক যে টেলিস্কোপ থেকে এসেছে সেখানেই ফিরিয়ে দেয়', 'সৌরশক্তিতে রেডিও সংকেত পাঠায়', 'পৃথিবীর ভিডিও করে', 'চন্দ্রকম্পন মাপে'],
      'কোণ-ঘনক প্রিজম আলোকে উৎসে ফিরিয়ে দেয়, আর মানমন্দির সেই প্রতিধ্বনির সময় মাপে।'],
  },
  {
    id: 'q28', ref: 'apollo11-lrrr',
    en: ['How many prisms are in the Apollo 11 laser reflector?', ['100', '3', '1,000', '12,000'],
      'Buzz Aldrin set out a panel of 100 fused-silica corner-cube prisms.'],
    bn: ['অ্যাপোলো ১১-এর লেজার প্রতিফলকে কয়টি প্রিজম আছে?', ['১০০', '৩', '১,০০০', '১২,০০০'],
      'বাজ অলড্রিন ১০০টি ফিউজড-সিলিকা কোণ-ঘনক প্রিজমের একটি প্যানেল বসান।'],
  },
  {
    id: 'q29', ref: 'apollo11-lrrr',
    en: ['What have the laser echoes from the Apollo reflectors shown about the Moon?', ['It is slowly moving away from Earth', 'It is slowly falling towards Earth', 'It has stopped spinning', 'It is getting bigger'],
      'Timing the echoes shows the Moon is slowly moving away from Earth.'],
    bn: ['অ্যাপোলো প্রতিফলকের লেজার প্রতিধ্বনি চাঁদ সম্পর্কে কী দেখিয়েছে?', ['এটি ধীরে ধীরে পৃথিবী থেকে দূরে সরে যাচ্ছে', 'এটি ধীরে ধীরে পৃথিবীর দিকে পড়ছে', 'এর ঘূর্ণন থেমে গেছে', 'এটি বড় হচ্ছে'],
      'প্রতিধ্বনির সময় মেপে দেখা যায়, চাঁদ ধীরে ধীরে পৃথিবী থেকে দূরে সরছে।'],
  },
  // ---------- Apollo 15 rover ----------
  {
    id: 'q30', ref: 'apollo15-lrv',
    en: ['How far did the Apollo 15 crew drive their Lunar Roving Vehicle?', ['27.76 km', '2.7 km', '277 km', '45.16 km'],
      'Dave Scott and Jim Irwin drove 27.76 km around Hadley Rille.'],
    bn: ['অ্যাপোলো ১৫-এর নভোচারীরা তাঁদের চন্দ্রযান (রোভার) কত দূর চালান?', ['২৭.৭৬ কিমি', '২.৭ কিমি', '২৭৭ কিমি', '৪৫.১৬ কিমি'],
      'ডেভ স্কট ও জিম আরউইন হ্যাডলি রিলের আশপাশে ২৭.৭৬ কিমি চালান।'],
  },
  {
    id: 'q31', ref: 'apollo15-lrv',
    en: ['How did astronauts steer the Lunar Roving Vehicle?', ['With a T-handle joystick between the seats', 'With a steering wheel', 'By remote control from Earth', 'By leaning left and right'],
      'It had no steering wheel: a small T-handle joystick sat between the seats.'],
    bn: ['নভোচারীরা চন্দ্র রোভার কীভাবে চালাতেন?', ['দুই আসনের মাঝে একটি টি-আকৃতির জয়স্টিক দিয়ে', 'স্টিয়ারিং হুইল দিয়ে', 'পৃথিবী থেকে রিমোট কন্ট্রোলে', 'ডানে-বাঁয়ে ঝুঁকে'],
      'এতে স্টিয়ারিং হুইল ছিল না; আসনের মাঝে ছোট টি-হ্যান্ডেল জয়স্টিক ছিল।'],
  },
  {
    id: 'q32', ref: 'apollo15-lrv',
    en: ['The rover weighed 210 kg on Earth. About how much did it weigh in the Moon’s gravity?', ['35 kg', '210 kg', '5 kg', '1,260 kg'],
      'In lunar gravity the 210 kg rover weighed about 35 kg.'],
    bn: ['রোভারটির ওজন পৃথিবীতে ছিল ২১০ কেজি। চাঁদের মাধ্যাকর্ষণে এর ওজন মোটামুটি কত?', ['৩৫ কেজি', '২১০ কেজি', '৫ কেজি', '১,২৬০ কেজি'],
      'চাঁদের মাধ্যাকর্ষণে ২১০ কেজির রোভারের ওজন প্রায় ৩৫ কেজি।'],
  },
  {
    id: 'q33', ref: 'apollo15-lrv',
    en: ['Why were the rover’s wheels made of woven wire mesh, not rubber tyres?', ['Rubber tyres could burst in a vacuum, and mesh gripped the loose soil', 'Rubber was too expensive', 'Mesh looks better on TV', 'To make it go faster'],
      'Mesh wheels could not burst in vacuum and gripped the fluffy regolith.'],
    bn: ['রোভারের চাকা রাবারের টায়ার না হয়ে বোনা তারের জালের কেন ছিল?', ['শূন্যে রাবারের টায়ার ফেটে যেতে পারত, আর জাল আলগা মাটি আঁকড়ে ধরত', 'রাবার খুব দামি ছিল', 'টিভিতে জাল দেখতে ভালো লাগে', 'দ্রুত চালানোর জন্য'],
      'জালের চাকা শূন্যে ফাটে না এবং নরম মাটি ভালোভাবে আঁকড়ে ধরে।'],
  },
  // ---------- ALSEP ----------
  {
    id: 'q34', ref: 'alsep-instruments',
    en: ['Why were the Apollo science stations (ALSEP) switched off in 1977?', ['Budget constraints', 'They broke in a moonquake', 'Their nuclear power ran out', 'Astronauts took them home'],
      'NASA deliberately switched them off in September 1977 because of budget constraints.'],
    bn: ['১৯৭৭ সালে অ্যাপোলো বিজ্ঞান কেন্দ্রগুলো (ALSEP) কেন বন্ধ করা হয়?', ['বাজেটের সীমাবদ্ধতা', 'চন্দ্রকম্পনে ভেঙে যায়', 'পারমাণবিক শক্তি ফুরিয়ে যায়', 'নভোচারীরা সেগুলো ফেরত আনেন'],
      'বাজেটের কারণে ১৯৭৭ সালের সেপ্টেম্বরে নাসা ইচ্ছে করে সেগুলো বন্ধ করে।'],
  },
  {
    id: 'q35', ref: 'alsep-instruments',
    en: ['What triggers the deep moonquakes discovered by the Apollo seismometers?', ['The tidal pull of Earth’s gravity', 'Volcanoes on the Moon', 'Astronauts walking', 'The solar wind'],
      'Deep moonquakes are triggered by Earth’s tidal gravity.'],
    bn: ['অ্যাপোলো সিসমোমিটারে ধরা পড়া গভীর চন্দ্রকম্পন কিসের কারণে হয়?', ['পৃথিবীর মাধ্যাকর্ষণের জোয়ার-টান', 'চাঁদের আগ্নেয়গিরি', 'নভোচারীদের হাঁটা', 'সৌর বায়ু'],
      'গভীর চন্দ্রকম্পন হয় পৃথিবীর জোয়ার-সৃষ্টিকারী মাধ্যাকর্ষণের টানে।'],
  },
  {
    id: 'q36', ref: 'alsep-instruments',
    en: ['When spent Apollo rocket stages were crashed into the Moon, what did the seismometers record?', ['The Moon “ringing like a bell” for hours', 'Total silence', 'A crack splitting the Moon', 'Radio music'],
      'The impacts set the Moon “ringing like a bell” for hours.'],
    bn: ['ব্যবহৃত অ্যাপোলো রকেট অংশ চাঁদে আছড়ে ফেলার পর সিসমোমিটার কী রেকর্ড করে?', ['ঘণ্টার পর ঘণ্টা চাঁদ “ঘণ্টার মতো বাজছে”', 'পুরো নীরবতা', 'চাঁদ ফেটে যাওয়ার শব্দ', 'রেডিওর গান'],
      'আঘাতে চাঁদ ঘণ্টার পর ঘণ্টা “ঘণ্টার মতো বেজেছিল”।'],
  },
  // ---------- Surveyor 3 ----------
  {
    id: 'q37', ref: 'surveyor3',
    en: ['Apollo 12 landed close to an older robot lander. How close?', ['About 160 m from Surveyor 3', 'About 16 km from Surveyor 3', 'Right on top of it', 'On the other side of the Moon'],
      'Apollo 12 made a pinpoint landing only 160 metres from Surveyor 3.'],
    bn: ['অ্যাপোলো ১২ একটি পুরোনো রোবট ল্যান্ডারের কাছে নেমেছিল। কত কাছে?', ['সার্ভেয়র ৩ থেকে প্রায় ১৬০ মিটার', 'সার্ভেয়র ৩ থেকে প্রায় ১৬ কিমি', 'ঠিক এর ওপরে', 'চাঁদের অন্য পাশে'],
      'অ্যাপোলো ১২ নিখুঁতভাবে সার্ভেয়র ৩ থেকে মাত্র ১৬০ মিটার দূরে নামে।'],
  },
  {
    id: 'q38', ref: 'surveyor3',
    en: ['Which part of Surveyor 3 did the Apollo 12 astronauts bring back to Earth?', ['Its TV camera', 'Its whole body', 'Its solar panel', 'Nothing'],
      'Conrad and Bean clipped off its TV camera (and scoop); the camera is now in the Smithsonian.'],
    bn: ['অ্যাপোলো ১২-এর নভোচারীরা সার্ভেয়র ৩-এর কোন অংশ পৃথিবীতে নিয়ে আসেন?', ['এর টিভি ক্যামেরা', 'পুরো যানটি', 'এর সৌর প্যানেল', 'কিছুই না'],
      'কনরাড ও বিন এর টিভি ক্যামেরা (ও স্কুপ) কেটে আনেন; ক্যামেরাটি এখন স্মিথসোনিয়ানে।'],
  },
  // ---------- Curiosity ----------
  {
    id: 'q39', ref: 'curiosity',
    en: ['How was Curiosity lowered onto the surface of Mars?', ['By a rocket-powered “sky crane”', 'By airbags that bounced', 'By a parachute alone', 'By astronauts'],
      'Curiosity was the first rover delivered by a sky crane.'],
    bn: ['কিউরিওসিটিকে মঙ্গলের মাটিতে কীভাবে নামানো হয়?', ['রকেটচালিত “স্কাই ক্রেন” দিয়ে', 'লাফানো এয়ারব্যাগ দিয়ে', 'শুধু প্যারাস্যুট দিয়ে', 'নভোচারীরা নামান'],
      'কিউরিওসিটিই প্রথম রোভার, যাকে স্কাই ক্রেন দিয়ে নামানো হয়।'],
  },
  {
    id: 'q40', ref: 'curiosity',
    en: ['What did Curiosity find that Gale Crater once held?', ['A long-lived lake', 'A glacier', 'A volcano', 'An ocean of oil'],
      'Gale Crater once held a long-lived lake that could have supported microbial life.'],
    bn: ['কিউরিওসিটি দেখেছে, গেইল গর্তে একসময় কী ছিল?', ['দীর্ঘস্থায়ী একটি হ্রদ', 'একটি হিমবাহ', 'একটি আগ্নেয়গিরি', 'তেলের সাগর'],
      'গেইল গর্তে একসময় দীর্ঘস্থায়ী হ্রদ ছিল, যেখানে অণুজীব বাঁচতে পারত।'],
  },
  {
    id: 'q41', ref: 'curiosity',
    en: ['Why can’t dust storms shut Curiosity down the way they stopped solar rovers?', ['It runs on a radioisotope generator, not solar panels', 'It hides in caves', 'It has a dust-proof roof', 'It sleeps through every storm'],
      'Its MMRTG gives steady power through dust storms and winters.'],
    bn: ['ধূলিঝড় সৌরচালিত রোভারগুলোর মতো কিউরিওসিটিকে কেন থামাতে পারে না?', ['এটি সৌর প্যানেলে নয়, রেডিওআইসোটোপ জেনারেটরে চলে', 'এটি গুহায় লুকায়', 'এর ধুলোরোধী ছাদ আছে', 'প্রতিটি ঝড়ে এটি ঘুমিয়ে থাকে'],
      'এর MMRTG ধূলিঝড় ও শীতেও স্থির শক্তি দেয়।'],
  },
  // ---------- Perseverance and Ingenuity ----------
  {
    id: 'q42', ref: 'ingenuity',
    en: ['Ingenuity was planned to fly 5 times. How many flights did it make?', ['72', '5', '12', '500'],
      'It made 72 flights before rotor damage ended its mission in January 2024.'],
    bn: ['ইনজেনুইটির ৫ বার ওড়ার পরিকল্পনা ছিল। আসলে এটি কতবার উড়েছিল?', ['৭২', '৫', '১২', '৫০০'],
      '২০২৪ সালের জানুয়ারিতে রোটর ক্ষতিগ্রস্ত হওয়ার আগে এটি ৭২ বার ওড়ে।'],
  },
  {
    id: 'q43', ref: 'ingenuity',
    en: ['Ingenuity carries a tiny piece of history. What is it?', ['Fabric from the Wright brothers’ 1903 Flyer', 'A Moon rock', 'A piece of Sojourner', 'A coin from 1969'],
      'It carries a small piece of fabric from the Wright brothers’ 1903 Flyer.'],
    bn: ['ইনজেনুইটি ইতিহাসের একটি ছোট টুকরো বহন করে। সেটা কী?', ['রাইট ভাইদের ১৯০৩ সালের ফ্লায়ারের কাপড়', 'চাঁদের পাথর', 'সোজার্নারের একটি অংশ', '১৯৬৯ সালের একটি মুদ্রা'],
      'এতে রাইট ভাইদের ১৯০৩ সালের ফ্লায়ারের এক টুকরো কাপড় আছে।'],
  },
  {
    id: 'q44', ref: 'perseverance-backshell',
    en: ['What hidden message was coded into Perseverance’s parachute?', ['“Dare mighty things”', '“Hello, Mars”', '“We came in peace”', '“To the stars”'],
      'The parachute pattern spelled “Dare mighty things” in binary code.'],
    bn: ['পারসিভিয়ারেন্সের প্যারাস্যুটে কোন গোপন বার্তা সংকেতে লেখা ছিল?', ['“Dare mighty things”', '“Hello, Mars”', '“We came in peace”', '“To the stars”'],
      'প্যারাস্যুটের নকশায় বাইনারি সংকেতে লেখা ছিল “Dare mighty things”।'],
  },
  {
    id: 'q45', ref: 'perseverance',
    en: ['What did Perseverance’s MOXIE experiment do?', ['Made oxygen from the Martian atmosphere', 'Melted ice into water', 'Grew plants', 'Measured marsquakes'],
      'MOXIE turned Martian carbon dioxide into oxygen.'],
    bn: ['পারসিভিয়ারেন্সের MOXIE পরীক্ষা কী করেছিল?', ['মঙ্গলের বায়ুমণ্ডল থেকে অক্সিজেন তৈরি করেছিল', 'বরফ গলিয়ে পানি বানিয়েছিল', 'গাছ জন্মিয়েছিল', 'মঙ্গলকম্পন মেপেছিল'],
      'MOXIE মঙ্গলের কার্বন ডাই-অক্সাইড থেকে অক্সিজেন তৈরি করেছিল।'],
  },
  // ---------- Lost, entry hardware, last landing ----------
  {
    id: 'q46', ref: 'opportunity-heatshield',
    en: ['Next to its own discarded heat shield, Opportunity found something that was a first. What?', ['The first meteorite identified on another planet', 'The first fossil on Mars', 'The first Martian cave', 'Liquid water'],
      'Heat Shield Rock, an iron-nickel meteorite, was the first meteorite identified on another planet.'],
    bn: ['নিজের ফেলে দেওয়া হিট শিল্ডের পাশে অপারচুনিটি এমন একটি জিনিস পায় যা ছিল প্রথম। সেটা কী?', ['অন্য গ্রহে শনাক্ত হওয়া প্রথম উল্কাপিণ্ড', 'মঙ্গলের প্রথম জীবাশ্ম', 'মঙ্গলের প্রথম গুহা', 'তরল পানি'],
      'হিট শিল্ড রক নামের লোহা-নিকেল উল্কাপিণ্ডটিই অন্য গ্রহে শনাক্ত হওয়া প্রথম উল্কাপিণ্ড।'],
  },
  {
    id: 'q47', ref: 'mars-polar-lander',
    en: ['What is the leading explanation for the loss of Mars Polar Lander in 1999?', ['Software read the jolt of the legs opening as touchdown and shut the engines off too early', 'It was hit by a meteorite', 'Its parachute was never packed', 'It landed in a lake'],
      'The legs’ jolt was likely read as touchdown, so the engines stopped while it was still about 40 m up.'],
    bn: ['১৯৯৯ সালে মার্স পোলার ল্যান্ডার হারানোর প্রধান ব্যাখ্যা কী?', ['পা খোলার ঝাঁকুনিকে সফটওয়্যার অবতরণ ভেবে আগেভাগে ইঞ্জিন বন্ধ করে দেয়', 'উল্কার আঘাত লাগে', 'প্যারাস্যুট ভাঁজ করে রাখাই হয়নি', 'এটি হ্রদে নামে'],
      'সম্ভবত পা খোলার ঝাঁকুনিকে অবতরণ ধরা হয়, ফলে প্রায় ৪০ মিটার ওপরে থাকতেই ইঞ্জিন বন্ধ হয়ে যায়।'],
  },
  {
    id: 'q48', ref: 'apollo17-challenger',
    en: ['Who was the last person to walk on the Moon?', ['Eugene Cernan (Apollo 17)', 'Neil Armstrong (Apollo 11)', 'Pete Conrad (Apollo 12)', 'Dave Scott (Apollo 15)'],
      'Eugene Cernan of Apollo 17 was the last person to walk on the Moon, in December 1972.'],
    bn: ['চাঁদে শেষবার কে হেঁটেছিলেন?', ['ইউজিন সারনান (অ্যাপোলো ১৭)', 'নিল আর্মস্ট্রং (অ্যাপোলো ১১)', 'পিট কনরাড (অ্যাপোলো ১২)', 'ডেভ স্কট (অ্যাপোলো ১৫)'],
      '১৯৭২ সালের ডিসেম্বরে অ্যাপোলো ১৭-এর ইউজিন সারনান চাঁদে শেষবার হাঁটেন।'],
  },
  {
    id: 'q49', ref: 'apollo17-challenger',
    en: ['Harrison Schmitt found orange soil at Shorty crater. What made it orange?', ['Ancient volcanic glass', 'Rust from a rocket', 'Martian dust', 'Paint from the lander'],
      'The orange soil formed from ancient volcanic glass.'],
    bn: ['হ্যারিসন শ্মিট শর্টি গর্তে কমলা মাটি খুঁজে পান। এটি কমলা কেন?', ['প্রাচীন আগ্নেয় কাচ', 'রকেটের মরিচা', 'মঙ্গলের ধুলো', 'ল্যান্ডারের রং'],
      'কমলা মাটিটি তৈরি হয়েছিল প্রাচীন আগ্নেয় কাচ থেকে।'],
  },
  {
    id: 'q50', ref: 'apollo14-sivb',
    en: ['Why was the Apollo 14 rocket’s third stage crashed into the Moon on purpose?', ['To give the seismometers a known shake to study the Moon’s interior', 'To get rid of rubbish', 'By accident', 'To make a landing pad'],
      'Its impact was recorded by the Apollo 12 seismometer 170 km away, probing the Moon’s crust.'],
    bn: ['অ্যাপোলো ১৪ রকেটের তৃতীয় অংশটি কেন ইচ্ছে করে চাঁদে আছড়ে ফেলা হয়?', ['সিসমোমিটারকে একটি জানা কম্পন দিয়ে চাঁদের ভেতরটা বোঝার জন্য', 'আবর্জনা ফেলার জন্য', 'দুর্ঘটনাবশত', 'অবতরণের জায়গা বানাতে'],
      '১৭০ কিমি দূরের অ্যাপোলো ১২ সিসমোমিটার এই আঘাত রেকর্ড করে, যা চাঁদের ভূত্বক বুঝতে সাহায্য করে।'],
  },
];

