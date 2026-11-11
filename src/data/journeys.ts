/**
 * "One machine, one journey": the life of a single machine, stage by stage, in English and Bangla.
 * Each journey is tied to an artifact in MISSIONS_DATA (`artifactId`): its name, dossier and
 * sources come from there. Every date and figure here is also in that artifact's dossier or in the
 * sources listed with it; Ingenuity and InSight were written only from their dossier entries.
 */

export interface JourneyStepText {
  /** When it happened, as shown in the margin (a date, a range of sols, or "Present day"). */
  when: string;
  badge: string;
  title: string;
  text: string;
  fact?: string;
}

export interface JourneyStep {
  en: JourneyStepText;
  bn: JourneyStepText;
}

export interface Journey {
  /** id of the artifact in MISSIONS_DATA */
  artifactId: string;
  /** Short label for the switcher */
  label: string;
  subtitle: { en: string; bn: string };
  steps: JourneyStep[];
}

export const JOURNEYS: Journey[] = [
  {
    artifactId: 'sojourner',
    label: 'Sojourner',
    subtitle: {
      en: 'The 11.5-kg, microwave-sized rover of Mars Pathfinder',
      bn: 'মার্স পাথফাইন্ডারের ১১.৫ কেজির, মাইক্রোওয়েভ ওভেনের সমান রোভার',
    },
    steps: [
      {
        en: {
          when: 'December 1996',
          badge: 'Launch',
          title: 'Liftoff from Cape Canaveral',
          text: 'Stowed inside the folded petals of the Mars Pathfinder lander, Sojourner launched on a Delta II rocket for a seven-month cruise to Mars.',
          fact: 'Rover mass: about 11.5 kg.',
        },
        bn: {
          when: 'ডিসেম্বর ১৯৯৬',
          badge: 'উৎক্ষেপণ',
          title: 'কেপ ক্যানাভেরাল থেকে যাত্রা',
          text: 'মার্স পাথফাইন্ডার ল্যান্ডারের ভাঁজ করা পাপড়ির ভেতরে গুটিয়ে রাখা সোজার্নার ডেল্টা ২ রকেটে চড়ে মঙ্গলের পথে সাত মাসের যাত্রা শুরু করে।',
          fact: 'রোভারের ভর: প্রায় ১১.৫ কেজি।',
        },
      },
      {
        en: {
          when: 'July 4, 1997',
          badge: 'Touchdown',
          title: 'Bouncing down at Ares Vallis',
          text: 'Pathfinder flew straight into the Martian atmosphere without going into orbit first. A parachute, retro-rockets and large airbags slowed it, and it bounced across the plain before coming to rest.',
        },
        bn: {
          when: '৪ জুলাই ১৯৯৭',
          badge: 'অবতরণ',
          title: 'আরেস ভ্যালিসে লাফিয়ে নামা',
          text: 'কক্ষপথে না ঢুকে পাথফাইন্ডার সরাসরি মঙ্গলের বায়ুমণ্ডলে ঢুকে পড়ে। প্যারাস্যুট, রেট্রো-রকেট আর বড় বড় এয়ারব্যাগ তার গতি কমায়, আর সমভূমির ওপর লাফাতে লাফাতে সেটি থামে।',
        },
      },
      {
        en: {
          when: 'July 5, 1997',
          badge: 'First drive',
          title: 'Wheels on another world',
          text: 'The petals opened and Sojourner rolled down a ramp onto the soil, the first wheeled rover to drive on Mars.',
          fact: 'Its rocker-bogie suspension later carried Spirit, Opportunity, Curiosity and Perseverance.',
        },
        bn: {
          when: '৫ জুলাই ১৯৯৭',
          badge: 'প্রথম চলা',
          title: 'অন্য এক জগতে চাকা',
          text: 'পাপড়ি খুলে গেলে সোজার্নার একটা র‍্যাম্প বেয়ে মাটিতে নেমে আসে: মঙ্গলে চলা প্রথম চাকাওয়ালা রোভার।',
          fact: 'এর রকার-বোগি সাসপেনশন পরে স্পিরিট, অপরচুনিটি, কিউরিওসিটি ও পারসিভিয়ারেন্সকেও বহন করেছে।',
        },
      },
      {
        en: {
          when: 'Sols 3–83',
          badge: 'Science',
          title: 'Reading the rocks Barnacle Bill and Yogi',
          text: 'Sojourner pressed its Alpha Particle X-ray Spectrometer against nearby rocks to measure what they are made of: the first chemical analysis of rocks on Mars by a rover.',
          fact: 'Sojourner sent back about 550 images before falling silent.',
        },
        bn: {
          when: 'সল ৩–৮৩',
          badge: 'বিজ্ঞান',
          title: 'বার্নাকল বিল আর ইয়োগি পাথর পড়া',
          text: 'সোজার্নার তার আলফা পার্টিকেল এক্স-রে স্পেকট্রোমিটার কাছের পাথরে চেপে ধরে মেপেছে সেগুলো কী দিয়ে তৈরি: মঙ্গলে কোনো রোভারের প্রথম পাথরের রাসায়নিক বিশ্লেষণ।',
          fact: 'নীরব হওয়ার আগে সোজার্নার প্রায় ৫৫০টি ছবি পাঠিয়েছিল।',
        },
      },
      {
        en: {
          when: 'September 27, 1997',
          badge: 'Last contact',
          title: 'The final radio silence',
          text: 'Contact with the Pathfinder lander, Sojourner’s only link to Earth, was lost. The cause was never confirmed.',
          fact: 'Built for 7 sols, it worked for 83.',
        },
        bn: {
          when: '২৭ সেপ্টেম্বর ১৯৯৭',
          badge: 'শেষ যোগাযোগ',
          title: 'শেষ রেডিও নীরবতা',
          text: 'পৃথিবীর সাথে সোজার্নারের একমাত্র সংযোগ পাথফাইন্ডার ল্যান্ডারের সাথে যোগাযোগ হারিয়ে যায়। কারণ কখনো নিশ্চিত হয়নি।',
          fact: 'বানানো হয়েছিল ৭ সলের জন্য, কাজ করেছে ৮৩ সল।',
        },
      },
      {
        en: {
          when: 'Present day',
          badge: 'Monument',
          title: 'A small rover beside a silent base',
          text: 'If it lost contact, its software told it to drive back towards the lander, so it may have ended its days circling the silent base station at Ares Vallis.',
          fact: 'Coordinates: 19.33° N, 33.55° W.',
        },
        bn: {
          when: 'বর্তমান',
          badge: 'স্মারক',
          title: 'নীরব ঘাঁটির পাশে ছোট্ট রোভার',
          text: 'যোগাযোগ হারালে ল্যান্ডারের দিকে ফিরে যেতে তার সফটওয়্যারে নির্দেশ ছিল, তাই হয়তো আরেস ভ্যালিসের নীরব ঘাঁটির চারপাশে ঘুরতে ঘুরতেই তার দিন শেষ হয়েছে।',
          fact: 'স্থানাঙ্ক: ১৯.৩৩° উ, ৩৩.৫৫° প।',
        },
      },
    ],
  },
  {
    artifactId: 'opportunity',
    label: 'Opportunity',
    subtitle: {
      en: 'Built for 90 sols, it drove 45.16 kilometres',
      bn: '৯০ সলের জন্য বানানো, চলেছে ৪৫.১৬ কিলোমিটার',
    },
    steps: [
      {
        en: {
          when: 'July 7, 2003',
          badge: 'Launch',
          title: 'Launch from Cape Canaveral',
          text: 'Opportunity launched on a Delta II rocket, carrying panoramic cameras and a rock abrasion tool to Meridiani Planum.',
        },
        bn: {
          when: '৭ জুলাই ২০০৩',
          badge: 'উৎক্ষেপণ',
          title: 'কেপ ক্যানাভেরাল থেকে উৎক্ষেপণ',
          text: 'প্যানোরামিক ক্যামেরা আর পাথর ঘষার যন্ত্র নিয়ে ডেল্টা ২ রকেটে চড়ে অপরচুনিটি রওনা দেয় মেরিডিয়ানি প্ল্যানামের পথে।',
        },
      },
      {
        en: {
          when: 'January 25, 2004',
          badge: 'Touchdown',
          title: 'Bouncing into Eagle Crater',
          text: 'Its airbags bounced into a small crater, right in front of a layered outcrop of ancient Martian bedrock.',
          fact: 'Its heat shield fell nearby; the rover drove back to inspect it in December 2004.',
        },
        bn: {
          when: '২৫ জানুয়ারি ২০০৪',
          badge: 'অবতরণ',
          title: 'লাফিয়ে ঈগল ক্রেটারে',
          text: 'এয়ারব্যাগে লাফাতে লাফাতে সেটি একটা ছোট ক্রেটারে গিয়ে পড়ে, ঠিক প্রাচীন মঙ্গলীয় শিলার স্তরযুক্ত একটি উন্মুক্ত অংশের সামনে।',
          fact: 'এর তাপ-ঢাল কাছেই পড়েছিল; ২০০৪ সালের ডিসেম্বরে রোভারটি ফিরে গিয়ে সেটি পরীক্ষা করে।',
        },
      },
      {
        en: {
          when: 'From 2004',
          badge: 'Signs of water',
          title: 'Hematite “blueberries”',
          text: 'It found tiny iron-rich spheres and sulfate minerals that form in water: evidence that liquid, acidic water once soaked the plains of Meridiani.',
        },
        bn: {
          when: '২০০৪ থেকে',
          badge: 'পানির চিহ্ন',
          title: 'হেমাটাইট “ব্লুবেরি”',
          text: 'সে খুঁজে পায় লোহাসমৃদ্ধ ছোট ছোট গোলক আর পানিতে তৈরি হওয়া সালফেট খনিজ: প্রমাণ যে একসময় তরল, অম্লীয় পানি মেরিডিয়ানির সমভূমি ভিজিয়ে রেখেছিল।',
        },
      },
      {
        en: {
          when: '2004–2018',
          badge: 'The long drive',
          title: 'Endurance, Victoria and Endeavour craters',
          text: 'It drove on from crater to crater. Wind gusts and dust devils sometimes cleaned dust off its solar panels and gave it more power.',
          fact: 'In March 2015 its odometer passed a full marathon distance (42.195 km).',
        },
        bn: {
          when: '২০০৪–২০১৮',
          badge: 'দীর্ঘ যাত্রা',
          title: 'এনডিউরেন্স, ভিক্টোরিয়া আর এনডেভার ক্রেটার',
          text: 'এক ক্রেটার থেকে আরেক ক্রেটারে সে এগিয়ে গেছে। মাঝে মাঝে দমকা হাওয়া আর ধুলোর ঘূর্ণি তার সোলার প্যানেলের ধুলো সরিয়ে দিয়ে আরও শক্তি জুগিয়েছে।',
          fact: '২০১৫ সালের মার্চে তার চলার দূরত্ব একটা পূর্ণ ম্যারাথন (৪২.১৯৫ কিমি) ছাড়িয়ে যায়।',
        },
      },
      {
        en: {
          when: 'June 10, 2018',
          badge: 'Last contact',
          title: 'The great dust storm of 2018',
          text: 'A dust storm that wrapped the whole planet blotted out the Sun over Endeavour Crater, and the solar-powered rover went quiet.',
          fact: 'NASA sent more than 1,000 recovery commands; none was answered.',
        },
        bn: {
          when: '১০ জুন ২০১৮',
          badge: 'শেষ যোগাযোগ',
          title: '২০১৮ সালের মহা ধুলোঝড়',
          text: 'গোটা গ্রহ ঢেকে দেওয়া এক ধুলোঝড় এনডেভার ক্রেটারের আকাশ থেকে সূর্য মুছে দেয়, আর সৌরশক্তিতে চলা রোভারটি নীরব হয়ে যায়।',
          fact: 'নাসা ১,০০০-এর বেশি উদ্ধার-কমান্ড পাঠিয়েছিল; একটিরও উত্তর আসেনি।',
        },
      },
      {
        en: {
          when: 'Present day',
          badge: 'Monument',
          title: 'Resting in Perseverance Valley',
          text: 'Opportunity rests in Perseverance Valley, on the rim of Endeavour Crater, presumed blanketed in dust.',
          fact: 'Total distance: 45.16 km in more than 14 years.',
        },
        bn: {
          when: 'বর্তমান',
          badge: 'স্মারক',
          title: 'পারসিভিয়ারেন্স ভ্যালিতে বিশ্রাম',
          text: 'এনডেভার ক্রেটারের কিনারে পারসিভিয়ারেন্স ভ্যালিতে অপরচুনিটি বিশ্রাম নিচ্ছে, ধারণা করা হয় ধুলোয় ঢাকা অবস্থায়।',
          fact: 'মোট দূরত্ব: ১৪ বছরেরও বেশি সময়ে ৪৫.১৬ কিমি।',
        },
      },
    ],
  },
  {
    artifactId: 'insight',
    label: 'InSight',
    subtitle: {
      en: 'The lander that listened to Mars instead of looking at it',
      bn: 'যে ল্যান্ডার মঙ্গলকে দেখেনি, শুনেছে',
    },
    steps: [
      {
        en: {
          when: 'November 26, 2018',
          badge: 'Touchdown',
          title: 'Landing on Elysium Planitia',
          text: 'InSight settled on a flat plain near the Martian equator, a quiet place to listen to the planet’s interior.',
          fact: 'Coordinates: 4.50° N, 135.62° E.',
        },
        bn: {
          when: '২৬ নভেম্বর ২০১৮',
          badge: 'অবতরণ',
          title: 'এলিসিয়াম প্ল্যানিশিয়ায় নামা',
          text: 'মঙ্গলের বিষুবরেখার কাছে এক সমতল ভূমিতে ইনসাইট নামে, গ্রহের ভেতরের শব্দ শোনার জন্য একটা শান্ত জায়গা।',
          fact: 'স্থানাঙ্ক: ৪.৫০° উ, ১৩৫.৬২° পূ।',
        },
      },
      {
        en: {
          when: 'After landing',
          badge: 'Set-up',
          title: 'Instruments lifted onto the ground',
          text: 'A robotic arm lifted the seismometer off the lander’s deck and set it on the surface, then covered it with a wind and thermal shield.',
          fact: 'The first mission to place instruments on another world’s surface this way.',
        },
        bn: {
          when: 'অবতরণের পর',
          badge: 'স্থাপন',
          title: 'যন্ত্র নামানো হলো মাটিতে',
          text: 'একটা রোবোটিক বাহু সিসমোমিটারটি ল্যান্ডারের ডেক থেকে তুলে মাটিতে বসায়, তারপর বাতাস ও তাপ থেকে বাঁচাতে একটা ঢাকনা দিয়ে ঢেকে দেয়।',
          fact: 'অন্য কোনো জগতের মাটিতে এভাবে যন্ত্র বসানো প্রথম মিশন।',
        },
      },
      {
        en: {
          when: '2018–2022',
          badge: 'Science',
          title: 'More than 1,300 marsquakes',
          text: 'The seismometer recorded marsquakes and meteorite impacts. Their waves revealed the crust, the mantle and a liquid iron core.',
          fact: 'The core is about 1,830 km in radius.',
        },
        bn: {
          when: '২০১৮–২০২২',
          badge: 'বিজ্ঞান',
          title: '১,৩০০-র বেশি মঙ্গলকম্প',
          text: 'সিসমোমিটার মঙ্গলকম্প আর উল্কাপাত রেকর্ড করেছে। সেই কম্পন-তরঙ্গ থেকে জানা গেছে ভূত্বক, ম্যান্টল আর তরল লোহার কেন্দ্রের কথা।',
          fact: 'কেন্দ্রের ব্যাসার্ধ প্রায় ১,৮৩০ কিমি।',
        },
      },
      {
        en: {
          when: 'Final years',
          badge: 'Fighting the dust',
          title: 'Sand thrown into the wind',
          text: 'As dust covered its solar panels, engineers used the arm’s scoop to trickle sand into the wind, so the gusts would carry some dust away and buy a few more months.',
        },
        bn: {
          when: 'শেষ বছরগুলো',
          badge: 'ধুলোর সাথে লড়াই',
          title: 'বাতাসে ছড়ানো বালি',
          text: 'সোলার প্যানেল ধুলোয় ঢেকে যেতে থাকলে প্রকৌশলীরা বাহুর স্কুপ দিয়ে বাতাসে বালি ছড়ান, যাতে দমকা হাওয়া কিছু ধুলো উড়িয়ে নেয় আর আরও কয়েক মাস সময় পাওয়া যায়।',
        },
      },
      {
        en: {
          when: 'December 15, 2022',
          badge: 'Last contact',
          title: 'A farewell in its own voice',
          text: 'That December NASA posted a farewell written in InSight’s voice: its power was very low, and this might be its last image.',
        },
        bn: {
          when: '১৫ ডিসেম্বর ২০২২',
          badge: 'শেষ যোগাযোগ',
          title: 'নিজের ভাষায় বিদায়',
          text: 'সেই ডিসেম্বরে নাসা ইনসাইটের ভাষায় লেখা একটি বিদায়বার্তা প্রকাশ করে: তার শক্তি খুব কমে গেছে, আর এটিই হয়তো তার শেষ ছবি।',
        },
      },
      {
        en: {
          when: 'Present day',
          badge: 'Silent',
          title: 'Under a coat of dust',
          text: 'InSight sits silent on Elysium Planitia, its solar panels thick with the dust that ended its mission.',
        },
        bn: {
          when: 'বর্তমান',
          badge: 'নীরব',
          title: 'ধুলোর চাদরের নিচে',
          text: 'এলিসিয়াম প্ল্যানিশিয়ায় ইনসাইট নীরবে বসে আছে, যে ধুলো তার মিশন শেষ করেছে সেই ধুলোয় ঢাকা সোলার প্যানেল নিয়ে।',
        },
      },
    ],
  },
  {
    artifactId: 'ingenuity',
    label: 'Ingenuity',
    subtitle: {
      en: 'Planned for 5 flights, it made 72',
      bn: 'পরিকল্পনা ছিল ৫টি উড্ডয়নের, সে উড়েছে ৭২ বার',
    },
    steps: [
      {
        en: {
          when: 'February 18, 2021',
          badge: 'Arrival',
          title: 'Riding under a rover',
          text: 'Ingenuity reached Jezero Crater riding under Perseverance’s belly.',
          fact: 'Mass: 1.8 kg.',
        },
        bn: {
          when: '১৮ ফেব্রুয়ারি ২০২১',
          badge: 'আগমন',
          title: 'রোভারের পেটের নিচে চড়ে',
          text: 'পারসিভিয়ারেন্সের পেটের নিচে চড়ে ইনজেনুইটি জেজেরো ক্রেটারে পৌঁছায়।',
          fact: 'ভর: ১.৮ কেজি।',
        },
      },
      {
        en: {
          when: 'April 19, 2021',
          badge: 'First flight',
          title: 'Under a minute in the air',
          text: 'The first powered, controlled flight on another planet lasted less than a minute, in air about one per cent as dense as Earth’s.',
          fact: 'Its two rotors spun at about 2,400 revolutions per minute.',
        },
        bn: {
          when: '১৯ এপ্রিল ২০২১',
          badge: 'প্রথম উড্ডয়ন',
          title: 'এক মিনিটেরও কম সময় আকাশে',
          text: 'অন্য গ্রহে প্রথম চালিত, নিয়ন্ত্রিত উড্ডয়ন টিকেছিল এক মিনিটেরও কম, পৃথিবীর তুলনায় মাত্র এক শতাংশ ঘন বাতাসে।',
          fact: 'এর দুটি রোটর মিনিটে প্রায় ২,৪০০ বার ঘুরত।',
        },
      },
      {
        en: {
          when: '2021–2024',
          badge: 'Scout',
          title: 'Eyes ahead of the rover',
          text: 'Planned as a five-flight test, it kept flying, scouting terrain ahead of Perseverance.',
        },
        bn: {
          when: '২০২১–২০২৪',
          badge: 'পথ দেখানো',
          title: 'রোভারের আগে আগে চোখ',
          text: 'পাঁচ উড্ডয়নের পরীক্ষা হিসেবে পরিকল্পনা হলেও সে উড়তেই থাকে, পারসিভিয়ারেন্সের সামনের পথ খুঁজে দেখে।',
        },
      },
      {
        en: {
          when: 'April 2022',
          badge: 'Archaeology from the air',
          title: 'Photographing its own landing gear',
          text: 'It flew over the backshell and parachute that had carried it and the rover to Mars, and photographed them lying on the crater floor.',
        },
        bn: {
          when: 'এপ্রিল ২০২২',
          badge: 'আকাশ থেকে প্রত্নতত্ত্ব',
          title: 'নিজের অবতরণ-সরঞ্জামের ছবি',
          text: 'যে ব্যাকশেল আর প্যারাস্যুট তাকে আর রোভারকে মঙ্গলে এনেছিল, সেগুলোর ওপর দিয়ে উড়ে গিয়ে ক্রেটারের মেঝেতে পড়ে থাকা অবস্থায় তাদের ছবি তোলে।',
        },
      },
      {
        en: {
          when: 'January 18, 2024',
          badge: 'Last flight',
          title: 'Flight 72',
          text: 'On its 72nd flight it landed hard and damaged its rotor blades, and its flying mission ended.',
        },
        bn: {
          when: '১৮ জানুয়ারি ২০২৪',
          badge: 'শেষ উড্ডয়ন',
          title: '৭২তম উড্ডয়ন',
          text: '৭২তম উড্ডয়নে সে জোরে নামে আর তার রোটরের পাখা ক্ষতিগ্রস্ত হয়; শেষ হয় তার উড়ার মিশন।',
        },
      },
      {
        en: {
          when: 'Present day',
          badge: 'Resting',
          title: 'A tiny figure at Valinor Hills',
          text: 'Perseverance photographed it weeks later among the sand ripples, at the spot the team named Valinor Hills. It carries a small piece of fabric from the Wright brothers’ 1903 Flyer.',
        },
        bn: {
          when: 'বর্তমান',
          badge: 'বিশ্রাম',
          title: 'ভ্যালিনর হিলসে ছোট্ট এক অবয়ব',
          text: 'কয়েক সপ্তাহ পর পারসিভিয়ারেন্স বালির ঢেউয়ের মাঝে তার ছবি তোলে, যে জায়গার নাম দল দিয়েছে ভ্যালিনর হিলস। সে বহন করছে রাইট ভাইদের ১৯০৩ সালের ফ্লায়ারের এক টুকরো কাপড়।',
        },
      },
    ],
  },
];
