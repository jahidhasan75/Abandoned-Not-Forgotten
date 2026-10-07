import { MissionArtifact, ConstellationNode, ConstellationLink, QuizQuestion } from '../types/mission';

export const MISSIONS_DATA: MissionArtifact[] = [
  // MARS MISSIONS
  {
    id: 'sojourner',
    artifactId: 'ARCH/MARS/001',
    name: 'Sojourner Rover',
    mission: 'Mars Pathfinder',
    destination: 'MARS',
    landingYear: 1997,
    lastContactYear: 1997,
    category: 'ROVER',
    status: 'SILENT',
    statusDescription: 'No longer communicating after base station battery failure on Sol 83',
    locationName: 'Ares Vallis (Chryse Planitia)',
    coordinates: {
      lat: '19.33° N',
      lng: '33.55° W',
      latNum: 19.33,
      lngNum: -33.55,
    },
    role: 'Pioneering mobile Mars micro-rover',
    story: 'Weighing only 11.5 kg (about the size of a microwave oven), Sojourner proved to a skeptical world that mobile robotic exploration was possible on Mars. Designed for only 7 Martian days (sols), it operated for 83 sols, circling the Pathfinder lander and analyzing rocks named Barnacle Bill and Yogi.',
    scienceContribution: [
      'First in-situ chemical analysis of Martian rocks using APXS',
      'Demonstrated autonomous hazard avoidance and rocker-bogie mobility',
      'Measured atmospheric dust opacity and wind drift'
    ],
    engineeringFeat: 'Pioneered the rocker-bogie suspension system that later carried Spirit, Opportunity, Curiosity, and Perseverance.',
    daysActive: 83,
    distanceTraveled: 'approx. 100 meters',
    image: '/src/assets/images/hero_space_archaeology_1790849307401.jpg',
    imageCaption: 'Illustrative archaeology archive visualization of a micro-rover at Ares Vallis',
    whyLeftBehind: 'Pathfinder was designed as a one-way technology demonstration. Earth-return would require an ascent rocket 20 times the mass of the entire payload.',
    subsystems: [
      { name: 'APXS Sensor', description: 'Alpha Particle X-ray Spectrometer deployed on rock faces', significance: 'Revealed silica-rich volcanic rocks similar to terrestrial andesites.' },
      { name: 'Rocker-Bogie Chassis', description: '6-wheel titanium cleated mobility suspension', significance: 'Could climb obstacles higher than its own wheel diameter.' },
      { name: 'GaAs Solar Array', description: '0.22 m² solar panel producing peak 16 Watts', significance: 'Survived extreme diurnal thermal swings between -80°C and 15°C.' }
    ],
    funFacts: [
      'Named after Sojourner Truth, the African American abolitionist and women\'s rights activist.',
      'Transmitted 550 pristine photographs back to Earth before falling silent.',
      'Its final planned command was to circle the silent lander base station in an eternal standby loop.'
    ],
    historicalQuote: {
      text: 'Sojourner was the mouse that roared across the solar system.',
      author: 'Dr. Matthew Golombek, Pathfinder Project Scientist'
    }
  },
  {
    id: 'opportunity',
    artifactId: 'ARCH/MARS/002',
    name: 'Opportunity Rover (MER-B)',
    mission: 'Mars Exploration Rover',
    destination: 'MARS',
    landingYear: 2004,
    lastContactYear: 2018,
    category: 'ROVER',
    status: 'SILENT',
    statusDescription: 'Presumed blanketed in dust following the historic planet-encircling 2018 dust storm',
    locationName: 'Endeavour Crater (Perseverance Valley)',
    coordinates: {
      lat: '2.28° S',
      lng: '5.23° W',
      latNum: -2.28,
      lngNum: -5.23,
    },
    role: 'Long-range robotic field geologist',
    story: 'Designed to survive 90 Martian days and travel 600 meters, Opportunity roamed Mars for over 14 years and covered a marathon distance of 45.16 kilometers. It found unmistakable evidence that liquid, acidic water once soaked the Martian plains of Meridiani.',
    scienceContribution: [
      'Discovered hematite-rich mineral spherules nicknamed "blueberries"',
      'Confirmed ancient groundwater systems and past habitable environments',
      'Documented deep cross-bedding strata inside Victoria and Endeavour craters'
    ],
    engineeringFeat: 'Drove 45.16 kilometers on another world powered solely by solar panels periodically cleaned by Martian dust devils.',
    daysActive: 5111,
    distanceTraveled: '45.16 km (marathon record)',
    image: '/src/assets/images/mars_opportunity_memorial_1790849335415.jpg',
    imageCaption: 'Illustrative rendering of Opportunity resting at the rim of Endeavour Crater',
    whyLeftBehind: 'Martian escape velocity is 5.03 km/s. Mars sample return requires dedicated ascent stages; Opportunity had no return propulsion.',
    subsystems: [
      { name: 'Pancam & Navcam', description: 'Stereoscopic high-resolution color camera mast', significance: 'Gave humanity panoramic eyes across hundreds of Martian vistas.' },
      { name: 'Mössbauer Spectrometer', description: 'Identified iron-bearing minerals in soil and bedrock', significance: 'Pinpointed jarosite, a sulfate mineral formed exclusively in water.' },
      { name: 'Rock Abrasion Tool (RAT)', description: 'Diamond-tipped grinder to scrape rock rinds', significance: 'Exposed pristine unweathered rock interiors.' }
    ],
    funFacts: [
      'Drove backwards for thousands of meters to spare a worn-out right-front steering actuator.',
      'Surfaced from an unexpected sand trap nicknamed "Purgatory Dune" after weeks of ground simulations.',
      'Last communication: June 10, 2018. Over a thousand wake-up songs were beamed to Opportunity during recovery efforts.'
    ],
    historicalQuote: {
      text: 'My battery is low and it is getting dark.',
      author: 'Poetic interpretation of final telemetry readings transmitted to Earth'
    }
  },
  {
    id: 'spirit',
    artifactId: 'ARCH/MARS/003',
    name: 'Spirit Rover (MER-A)',
    mission: 'Mars Exploration Rover',
    destination: 'MARS',
    landingYear: 2004,
    lastContactYear: 2010,
    category: 'ROVER',
    status: 'SILENT',
    statusDescription: 'Trapped in loose sand at Troy; unable to tilt solar panels toward winter sun in 2010',
    locationName: 'Gusev Crater (Columbia Hills / Troy)',
    coordinates: {
      lat: '14.57° S',
      lng: '175.47° E',
      latNum: -14.57,
      lngNum: 175.47,
    },
    role: 'Robotic field geologist and crater explorer',
    story: 'Opportunity’s twin sister Spirit landed on the opposite side of Mars in rugged Gusev Crater. Even after its right-front wheel seized up in 2006, Spirit dragged the dead wheel across the soil. That dragging wheel scraped away topsoil to accidentally uncover 90% pure silica—the signature of ancient volcanic hot springs where microbial life could have thrived.',
    scienceContribution: [
      'Discovered hydrothermal volcanic deposits (silica) in Home Plate',
      'Climbed Husband Hill to map ancient impact basin morphology',
      'Captured first ever Martian dust devils in live motion sequence'
    ],
    engineeringFeat: 'Operated for more than 20 times its planned design lifetime despite mechanical wear and catastrophic terrain entrapment.',
    daysActive: 2210,
    distanceTraveled: '7.73 km',
    image: '/src/assets/images/rover_years_later_1790849363552.jpg',
    imageCaption: 'Illustrative space archaeology rendering of Spirit on the Martian plains',
    whyLeftBehind: 'Exploration rovers carry no launch propellant; they remain as monuments to human ingenuity at their final science coordinates.',
    subsystems: [
      { name: 'Microscopic Imager', description: 'Extreme close-up lens on robotic arm', significance: 'Revealed millimeter-scale sedimentary structures.' },
      { name: 'Mini-TES Spectrometer', description: 'Miniature Thermal Emission Spectrometer', significance: 'Surveyed mineral composition of rocks from hundreds of meters away.' }
    ],
    funFacts: [
      'Accidentally made its greatest discovery because of a broken wheel dragging through the sand.',
      'Named peaks in the Columbia Hills after the fallen astronauts of Space Shuttle Columbia STS-107.'
    ],
    historicalQuote: {
      text: 'Spirit gave us the keys to an ancient, volcanic, and water-rich Mars.',
      author: 'Steve Squyres, MER Principal Investigator'
    }
  },
  {
    id: 'phoenix',
    artifactId: 'ARCH/MARS/004',
    name: 'Phoenix Mars Lander',
    mission: 'Mars Scout Program',
    destination: 'MARS',
    landingYear: 2008,
    lastContactYear: 2008,
    category: 'LANDER',
    status: 'SILENT',
    statusDescription: 'Mission complete; solar panels crushed by tons of carbon dioxide dry ice during northern winter',
    locationName: 'Green Valley (Vastitas Borealis)',
    coordinates: {
      lat: '68.22° N',
      lng: '125.75° W',
      latNum: 68.22,
      lngNum: -125.75,
    },
    role: 'Arctic ice excavator and soil chemistry lab',
    story: 'Phoenix touched down on the frigid arctic plains of Mars. With its robotic arm, it scraped shallow trenches into the soil and exposed bright white patches that evaporated over several days—confirming they were water ice. Phoenix tasted Martian water for the first time in human history.',
    scienceContribution: [
      'First direct sample and confirmation of subsurface water ice on Mars',
      'Discovered perchlorate salts in Martian soil, an oxidizer and chemical energy source',
      'Observed snow falling from Martian cirrus clouds using laser LiDAR'
    ],
    engineeringFeat: 'Used pulsed descent thrusters to land gently on arctic terrain without creating deep landing trenches.',
    daysActive: 161,
    image: '/src/assets/images/rover_mission_day_one_1790849350841.jpg',
    imageCaption: 'Illustrative rendering of polar lander with deployed robotic arm',
    whyLeftBehind: 'Stationary landers have no propulsion to lift off; northern Martian winter encapsulates the craft in frozen CO2.',
    subsystems: [
      { name: 'TEGA Oven Suite', description: 'Thermal and Evolved-Gas Analyzer ovens', significance: 'Heated soil to 1000°C to release and analyze trapped water vapor.' },
      { name: 'Robotic Arm RA', description: '2.35m trenching scoop with motorized rasp', significance: 'Dug down through cement-hard permafrost.' }
    ],
    funFacts: [
      'The trenches it dug were given names from children\'s stories like Snow White and Peter Pan.',
      'Orbiters spotted Phoenix years later, confirming its solar panels had folded under heavy seasonal dry ice.'
    ]
  },
  {
    id: 'insight',
    artifactId: 'ARCH/MARS/005',
    name: 'InSight Lander',
    mission: 'Discovery Program',
    destination: 'MARS',
    landingYear: 2018,
    lastContactYear: 2022,
    category: 'LANDER',
    status: 'SILENT',
    statusDescription: 'Solar power depleted by heavy dust accumulation over 4 years of monitoring Marsquakes',
    locationName: 'Elysium Planitia',
    coordinates: {
      lat: '4.50° N',
      lng: '135.62° E',
      latNum: 4.50,
      lngNum: 135.62,
    },
    role: 'Planetary interior geophysics observatory',
    story: 'Instead of looking at the surface, InSight checked the heartbeat and vital signs of Mars. It placed an ultra-sensitive seismometer directly onto the ground, listening to more than 1,300 marsquakes and meteorite impacts, mapping the crust, mantle, and molten liquid iron core.',
    scienceContribution: [
      'Detected over 1,318 Marsquakes up to magnitude 5',
      'Determined the precise size and liquid state of the Martian core (~1,830 km radius)',
      'Recorded real-time seismic waves from fresh meteorite impact craters'
    ],
    engineeringFeat: 'First mission to deploy an autonomous robotic grapple to lift instruments off a lander deck and set them onto an alien surface.',
    daysActive: 1440,
    image: '/src/assets/images/hero_space_archaeology_1790849307401.jpg',
    imageCaption: 'Illustrative rendering of InSight listening to planetary seismic pulses',
    whyLeftBehind: 'Geophysical observatories are built to permanently monitor tectonic and thermal activity until environmental wear stops them.',
    subsystems: [
      { name: 'SEIS Seismometer', description: 'Ultra-shielded vacuum-enclosed seismic sensor', significance: 'Could detect ground vibrations smaller than the width of a hydrogen atom.' },
      { name: 'WTS Shield', description: 'Wind and Thermal Shield dome', significance: 'Protected SEIS from howling Martian winds and wild temperature shifts.' },
      { name: 'HP³ Heat Flow Probe', description: 'Self-hammering "mole" probe', significance: 'Taught engineers how difficult compacted Martian regolith is to penetrate.' }
    ],
    funFacts: [
      'Engineers used InSight\'s robotic scoop to trickle sand into the wind, letting gusts blow away dust from the solar panels to squeeze out extra months of life.',
      'Its final message thanked its mission team for letting it listen to the quiet murmurs of Mars.'
    ]
  },
  {
    id: 'viking1',
    artifactId: 'ARCH/MARS/006',
    name: 'Viking 1 Lander',
    mission: 'Viking Project',
    destination: 'MARS',
    landingYear: 1976,
    lastContactYear: 1982,
    category: 'LANDER',
    status: 'HISTORIC',
    statusDescription: 'Commemorated as Thomas Mutch Memorial Station; permanently resting at Chryse Planitia',
    locationName: 'Chryse Planitia ("Plains of Gold")',
    coordinates: {
      lat: '22.48° N',
      lng: '47.97° W',
      latNum: 22.48,
      lngNum: -47.97,
    },
    role: 'First long-duration Mars lander and life-detection laboratory',
    story: 'On July 20, 1976, Viking 1 sent humanity\'s first clear panoramic photograph from the surface of Mars. For more than six years, it collected meteorological data, scooped Martian soil, and conducted humanity\'s first biological experiments on another world.',
    scienceContribution: [
      'First high-resolution surface panoramas and color imaging of Mars',
      'Conducted first automated biology and gas-exchange experiments on extraterrestrial soil',
      'First continuous multi-year Martian weather record (temperature, pressure, winds)'
    ],
    engineeringFeat: 'Powered by two Radioisotope Thermoelectric Generators (RTGs) which provided steady warmth and electricity in sub-zero cold.',
    daysActive: 2307,
    image: '/src/assets/images/rover_years_later_1790849363552.jpg',
    imageCaption: 'Illustrative archaeology rendering of Viking 1 Lander on Chryse Planitia',
    whyLeftBehind: 'Viking 1 was a static science outpost with no ascent stage; it laid the foundation for every subsequent Mars rover.',
    subsystems: [
      { name: 'SNAP-19 RTG', description: 'Plutonium-238 thermoelectric generators', significance: 'Provided immune-to-dust electrical power for over 6 continuous years.' },
      { name: 'Gas Chromatograph Mass Spec', description: 'GCMS soil organic molecule detector', significance: 'Set baseline limits for organic chemistry on the Martian surface.' }
    ],
    funFacts: [
      'In January 1982, NASA officially renamed the lander the Thomas A. Mutch Memorial Station in honor of the Viking imaging team leader.',
      'Accidentally lost contact when an erroneous software command overwrote its high-gain antenna pointing program.'
    ]
  },

  // MOON MISSIONS
  {
    id: 'apollo11-descent',
    artifactId: 'ARCH/MOON/001',
    name: 'Apollo 11 Lunar Module Descent Stage ("Eagle")',
    mission: 'Apollo 11',
    destination: 'MOON',
    landingYear: 1969,
    lastContactYear: 1969,
    category: 'HISTORIC_SITE',
    status: 'HISTORIC',
    statusDescription: 'Historic archaeological monument at Tranquility Base; resting intact on the lunar regolith',
    locationName: 'Mare Tranquillitatis (Sea of Tranquility)',
    coordinates: {
      lat: '0.67° N',
      lng: '23.47° E',
      latNum: 0.67,
      lngNum: 23.47,
    },
    role: 'Lunar descent stage and launch platform',
    story: 'When Neil Armstrong and Buzz Aldrin blasted off from the Moon on July 21, 1969, they left the lower portion of the Eagle lander behind. Its four spidery landing legs, gold Kapton foil, and stainless steel plaque reading "We came in peace for all mankind" remain exactly where humanity first stepped onto another celestial body.',
    scienceContribution: [
      'Enabled humanity\'s first collection of pristine lunar rock and regolith samples (21.5 kg)',
      'Deployed the Early Apollo Scientific Experiments Package (EASEP)',
      'Served as launch pad for first extraterrestrial liftoff'
    ],
    engineeringFeat: 'Throttleable descent rocket engine capable of throttling between 10% and 60% thrust to allow manual piloting around craters and boulder fields.',
    daysActive: 1,
    image: '/src/assets/images/moon_lunar_lander_site_1790849322452.jpg',
    imageCaption: 'Illustrative space archaeology rendering of Apollo Lunar Module Descent Stage on the Moon',
    whyLeftBehind: 'Staging physics. Every kilogram lifted off the lunar surface requires exponentially more fuel; leaving the descent stage behind cut the ascent weight by half.',
    subsystems: [
      { name: 'Descent Propulsion System (DPS)', description: 'Hypergolic throttleable liquid engine', significance: 'First rocket engine that could be throttled in deep space to touch down gently.' },
      { name: 'Crushable Honeycomb Struts', description: 'Aluminum honeycomb shock absorbers inside landing gear', significance: 'Absorbed the touchdown kinetic impact without bouncing.' },
      { name: 'Commemorative Plaque', description: 'Stainless steel plaque bearing Earth hemispheres', significance: 'Historical artifact of peaceful global exploration.' }
    ],
    funFacts: [
      'Armstrong piloted the lander manually for the final 60 seconds because the computer was guiding them toward a boulder-strewn crater.',
      'The boots worn by the astronauts were also discarded on the surface to save weight for lunar rocks!'
    ],
    historicalQuote: {
      text: 'Houston, Tranquility Base here. The Eagle has landed.',
      author: 'Neil A. Armstrong, July 20, 1969'
    }
  },
  {
    id: 'apollo15-lrv',
    artifactId: 'ARCH/MOON/002',
    name: 'Lunar Roving Vehicle 1 (LRV-001)',
    mission: 'Apollo 15',
    destination: 'MOON',
    landingYear: 1971,
    lastContactYear: 1971,
    category: 'ROVER',
    status: 'HISTORIC',
    statusDescription: 'Parked 300 meters east of the Falcon lunar module; remains parked on the plain of Hadley Rille',
    locationName: 'Hadley-Apennine Region (Hadley Rille)',
    coordinates: {
      lat: '26.13° N',
      lng: '3.63° E',
      latNum: 26.13,
      lngNum: 3.63,
    },
    role: 'First crewed electric planetary buggy',
    story: 'Nicknamed the "Moon Buggy," the Lunar Roving Vehicle transformed Apollo from short walking strolls into extensive geological field expeditions. Astronauts Dave Scott and Jim Irwin drove 27.8 kilometers, exploring the steep flanks of Mount Hadley Delta and the 300-meter-deep Hadley Rille canyon.',
    scienceContribution: [
      'Tripled the exploration radius of astronauts from 1 km to over 5 km',
      'Enabled discovery of the "Genesis Rock" (anorthosite dated to 4.1 billion years old)',
      'Carried 77 kg of lunar samples back to the ascent stage'
    ],
    engineeringFeat: 'Folded like origami into a tiny 0.9 m³ triangle on the side of the Lunar Module, deploying automatically with cables and pulleys.',
    daysActive: 3,
    distanceTraveled: '27.76 km',
    image: '/src/assets/images/hero_space_archaeology_1790849307401.jpg',
    imageCaption: 'Illustrative rendering of the Lunar Roving Vehicle resting at Taurus-Littrow/Hadley',
    whyLeftBehind: 'The LRV weighed 210 kg on Earth (35 kg in Moon gravity); lifting it back into lunar orbit was impossible with Apollo mass budgets.',
    subsystems: [
      { name: 'Woven Wire Mesh Wheels', description: 'Zinc-coated steel wire mesh with titanium chevrons', significance: 'Prevented rubber tires from bursting in vacuum and gripped fluffy regolith.' },
      { name: 'Four Independent DC Motors', description: '0.25 horsepower motor inside each wheel hub', significance: 'Could steer with front or rear wheels independently.' },
      { name: 'Color TV Camera Mast', description: 'Ground-controlled television camera', significance: 'Broadcast the first live liftoff of an Apollo ascent stage from the Moon.' }
    ],
    funFacts: [
      'Had no steering wheel—astronauts steered with a small T-handle joystick between their seats.',
      'On Apollo 17, astronaut Gene Cernan broke a fender and repaired it with lunar maps and duct tape!'
    ],
    historicalQuote: {
      text: 'Man\'s first wheels on another celestial body.',
      author: 'David R. Scott, Apollo 15 Commander'
    }
  },
  {
    id: 'alsep-instruments',
    artifactId: 'ARCH/MOON/003',
    name: 'Apollo ALSEP Science Stations',
    mission: 'Apollo 12, 14, 15, 16, 17',
    destination: 'MOON',
    landingYear: 1969,
    lastContactYear: 1977,
    category: 'INSTRUMENT',
    status: 'INACTIVE',
    statusDescription: 'Operated continuously until deliberately switched off by NASA in September 1977 due to budget constraints',
    locationName: 'Multiple Lunar Basins (Ocean of Storms, Fra Mauro, Hadley, Descartes, Taurus-Littrow)',
    coordinates: {
      lat: '3.01° S',
      lng: '23.42° W',
      latNum: -3.01,
      lngNum: -23.42,
    },
    role: 'Nuclear-powered automated lunar geophysical stations',
    story: 'The Apollo Lunar Surface Experiments Package (ALSEP) was a suite of scientific instruments left behind by astronauts. Powered by miniature SNAP-27 nuclear generators, these stations functioned around the clock for up to 8 years, transmitting seismic waves, solar wind data, and heat flow measurements back to Earth.',
    scienceContribution: [
      'Discovered deep Moonquakes triggered by Earth tidal gravity forces',
      'Confirmed the Moon has a small solid mantle and possibly partially molten core',
      'Measured the tenuous lunar atmosphere and charged solar wind ionosphere'
    ],
    engineeringFeat: 'Nuclear thermoelectric power generators withstood lunar day/night temperature swings of 300°C for nearly a decade.',
    daysActive: 2870,
    image: '/src/assets/images/moon_lunar_lander_site_1790849322452.jpg',
    imageCaption: 'Illustrative rendering of ALSEP central transmitter and seismometers',
    whyLeftBehind: 'Designed specifically as long-term stationary monitoring stations to observe the Moon continuously over years.',
    subsystems: [
      { name: 'Passive Seismic Experiment (PSE)', description: 'Three-component long-period seismometer', significance: 'Detected over 12,000 seismic events on the Moon.' },
      { name: 'SNAP-27 Radioisotope Generator', description: 'Plutonium-238 heat converted to 73W electricity', significance: 'Uninterrupted power throughout 14-day lunar nights.' },
      { name: 'Laser Ranging Retroreflector (LRRR)', description: 'Array of 100 quartz corner-cube prisms', significance: 'STILL IN USE TODAY: Earth lasers bounce off it to measure Moon distance to millimeter accuracy!' }
    ],
    funFacts: [
      'While the electronic stations were turned off in 1977, the mirror retroreflectors need NO electricity and are still used by scientists today in 2026!',
      'When Apollo ascent stages intentionally crashed into the Moon, the ALSEPs recorded the Moon "ringing like a bell" for hours.'
    ]
  },
  {
    id: 'surveyor3',
    artifactId: 'ARCH/MOON/004',
    name: 'Surveyor 3 Robot Lander',
    mission: 'Surveyor Program',
    destination: 'MOON',
    landingYear: 1967,
    lastContactYear: 1967,
    category: 'LANDER',
    status: 'HISTORIC',
    statusDescription: 'Historic archaeological site; visited by Apollo 12 astronauts Pete Conrad & Alan Bean in 1969',
    locationName: 'Oceanus Procellarum (Ocean of Storms)',
    coordinates: {
      lat: '3.01° S',
      lng: '23.42° W',
      latNum: -3.01,
      lngNum: -23.42,
    },
    role: 'Pre-Apollo lunar scout and robotic soil sampler',
    story: 'Surveyor 3 landed on the Moon in April 1967 to prove the lunar surface was firm enough for human astronauts. Two and a half years later, Apollo 12 executed a pinpoint landing only 160 meters away. Pete Conrad and Alan Bean walked over to Surveyor 3, inspected its weathered parts, and clipped off its TV camera and mechanical scoop to bring back to Earth—humanity\'s first true space archaeology recovery!',
    scienceContribution: [
      'Proved lunar regolith could support the weight of heavy manned landers',
      'Conducted first mechanical digging and bearing-strength tests',
      'Enabled first forensic analysis of human-made materials exposed to deep space radiation and micrometeroids for 2.5 years'
    ],
    engineeringFeat: 'Executed closed-loop radar-guided retro-rocket landing inside a lunar crater.',
    daysActive: 14,
    image: '/src/assets/images/rover_mission_day_one_1790849350841.jpg',
    imageCaption: 'Illustrative rendering of Surveyor 3 resting inside Surveyor Crater',
    whyLeftBehind: 'Precursor missions were expendable scouts designed to prepare the path for the Apollo landings.',
    subsystems: [
      { name: 'Surface Sampler Scoop', description: 'Motorized pantograph digging bucket', significance: 'Dug four trenches up to 17.5 cm deep into lunar soil.' },
      { name: 'Vidicon Television Camera', description: 'Scanning mirror television transmitter', significance: 'Retrieved by Apollo 12; now preserved in the Smithsonian National Air and Space Museum.' }
    ],
    funFacts: [
      'When scientists on Earth examined the returned camera, they discovered dormant bacteria (Streptococcus mitis) inside, sparking debates on microbial survival in space.',
      'Pete Conrad took a famous photograph of Alan Bean standing beside Surveyor 3 with the Intrepid lunar module in the background.'
    ]
  }
];

export const CONSTELLATION_NODES: ConstellationNode[] = [
  // Machines
  { id: 'm-sojourner', label: 'Sojourner', category: 'machine', destination: 'MARS', description: 'First mobile robot on Mars (1997)', x: 180, y: 140 },
  { id: 'm-spirit', label: 'Spirit', category: 'machine', destination: 'MARS', description: 'Gusev crater & silica deposits (2004)', x: 260, y: 280 },
  { id: 'm-opportunity', label: 'Opportunity', category: 'machine', destination: 'MARS', description: 'Meridiani water evidence & 45km marathon (2004)', x: 380, y: 150 },
  { id: 'm-insight', label: 'InSight', category: 'machine', destination: 'MARS', description: 'Geophysics & 1300+ marsquakes (2018)', x: 490, y: 310 },
  { id: 'm-apollo11', label: 'Apollo 11 Eagle', category: 'machine', destination: 'MOON', description: 'First crewed lunar landing site (1969)', x: 680, y: 140 },
  { id: 'm-apollo15', label: 'Apollo 15 LRV', category: 'machine', destination: 'MOON', description: 'First crewed planetary rover (1971)', x: 800, y: 270 },
  { id: 'm-alsep', label: 'Apollo ALSEP', category: 'machine', destination: 'MOON', description: 'Nuclear seismic & magnetic network (1969-77)', x: 920, y: 160 },

  // Science Discoveries
  { id: 's-mobility', label: 'Autonomous Mobility', category: 'science', description: 'Rocker-bogie chassis & hazard avoidance across boulders', x: 220, y: 70 },
  { id: 's-water', label: 'Ancient Liquid Water', category: 'breakthrough', description: 'Hematite berries, jarosite minerals, and river gravels', x: 320, y: 220 },
  { id: 's-hydrothermal', label: 'Hydrothermal Springs', category: 'science', description: 'Pure silica deposits indicating ancient hot water vents', x: 200, y: 390 },
  { id: 's-interior', label: 'Planetary Core & Seismology', category: 'breakthrough', description: 'Measuring internal crust thickness and liquid metallic cores', x: 580, y: 370 },
  { id: 's-lunar-geology', label: 'Lunar Primordial Crust', category: 'science', description: 'Genesis rock and deep anorthosite magma ocean theory', x: 740, y: 80 },
  { id: 's-moonquakes', label: 'Moonquake Dynamics', category: 'breakthrough', description: 'Tidal forces and ringing acoustic properties of lunar rock', x: 880, y: 330 },
  { id: 's-retroreflector', label: 'Laser Moon Ranging', category: 'science', description: 'Active today: measuring Moon distance to millimeter precision', x: 1000, y: 220 }
];

export const CONSTELLATION_LINKS: ConstellationLink[] = [
  { source: 'm-sojourner', target: 's-mobility', label: 'Rocker-Bogie proof' },
  { source: 'm-sojourner', target: 's-water', label: 'Ares Vallis flood plain' },
  { source: 'm-opportunity', target: 's-water', label: 'Hematite discovery' },
  { source: 'm-opportunity', target: 's-mobility', label: '45.16 km navigation' },
  { source: 'm-spirit', target: 's-hydrothermal', label: 'Broken wheel silica find' },
  { source: 'm-spirit', target: 's-water', label: 'Volcanic hydrothermal vents' },
  { source: 'm-insight', target: 's-interior', label: '1,318 Marsquakes analyzed' },
  { source: 'm-apollo11', target: 's-lunar-geology', label: 'First 21.5 kg regolith' },
  { source: 'm-apollo15', target: 's-lunar-geology', label: 'Genesis Rock 4.1 Ga' },
  { source: 'm-apollo15', target: 's-mobility', label: 'First crewed rover on Moon' },
  { source: 'm-alsep', target: 's-moonquakes', label: '12,000 seismic tremors' },
  { source: 'm-alsep', target: 's-interior', label: 'Moon core & crust model' },
  { source: 'm-alsep', target: 's-retroreflector', label: 'Millimeter laser ranging' }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which robotic explorer was the very first wheeled rover to drive on the surface of Mars?',
    options: ['Curiosity', 'Sojourner', 'Opportunity', 'Perseverance'],
    correctIndex: 1,
    explanation: 'Sojourner landed on Mars on July 4, 1997 as part of the Mars Pathfinder mission, proving mobile rovers could survive on Mars.',
    missionRef: 'Sojourner (1997)'
  },
  {
    id: 2,
    question: 'Why did NASA leave the descent stages of Apollo lunar landers behind on the Moon?',
    options: [
      'They forgot the launch keys',
      'The descent stages were used as launch pads and leaving them saved rocket fuel needed to reach orbit',
      'Astronauts wanted to build a museum immediately',
      'The engines could not be turned off'
    ],
    correctIndex: 1,
    explanation: 'By the physics of rocket staging (the Tsiolkovsky rocket equation), shedding the heavy descent stage cut the ascent module weight in half, requiring vastly less propellant to escape lunar gravity.',
    missionRef: 'Apollo Lunar Modules (1969–1972)'
  },
  {
    id: 3,
    question: 'How did the Spirit rover accidentally uncover 90% pure silica on Mars, proving ancient hydrothermal vents existed?',
    options: [
      'It dropped a laser onto a mountain',
      'Its seized right-front wheel dragged through the dirt and scraped open the bright subsurface mineral',
      'A Martian dust devil blew away a boulder',
      'It drilled into an ancient riverbed'
    ],
    correctIndex: 1,
    explanation: 'In 2006, Spirit\'s right front wheel stopped turning. By driving backwards and dragging the jammed wheel, it scraped away the topsoil to reveal pure silica.',
    missionRef: 'Spirit Rover (2004–2010)'
  },
  {
    id: 4,
    question: 'Which instrument left behind by Apollo astronauts on the Moon is STILL active and used by scientists around the world today?',
    options: [
      'The Lunar Module ascent computer',
      'The Lunar Roving Vehicle headlights',
      'The Laser Ranging Retroreflector mirror prisms',
      'The solar wind ion detector'
    ],
    correctIndex: 2,
    explanation: 'The Laser Ranging Retroreflectors require zero electrical power. Observatories on Earth shine pulsed laser beams at these mirrors to measure the distance to the Moon down to millimeter precision!',
    missionRef: 'Apollo ALSEP Retroreflectors'
  },
  {
    id: 5,
    question: 'What did the InSight lander detect over 1,300 times before its solar panels were blanketed in dust?',
    options: [
      'Alien radio signals',
      'Marsquakes and meteorite impacts',
      'Lightning storms',
      'Liquid volcanic eruptions'
    ],
    correctIndex: 1,
    explanation: 'InSight\'s SEIS seismometer detected 1,318 distinct marsquakes and meteorite shockwaves, mapping the internal layers of Mars.',
    missionRef: 'InSight Lander (2018–2022)'
  }
];

export const WHY_LEAVE_IT_REASONS = [
  {
    id: 'rocket-equation',
    title: 'The Tyranny of the Rocket Equation',
    subtitle: 'Exponential Fuel Scaling',
    summary: 'To lift a 1,000 kg machine off Mars and fly it back to Earth, you need an ascent rocket weighing over 15,000 kg on Mars. Launching that return rocket from Earth would require a colossal booster hundreds of times heavier.',
    metric: '5.03 km/s',
    metricLabel: 'Mars Escape Velocity',
    detail: 'Every single kilogram carried to Mars costs tens of thousands of dollars in launch vehicle propellant. By making surface explorers one-way outposts, NASA could pack 500% more scientific sensors, cameras, spectrometers, and drills instead of heavy return fuel tanks.'
  },
  {
    id: 'extended-science',
    title: 'Science Long After Primary Mission',
    subtitle: 'From Months to Decades',
    summary: 'Machines designed for 90 days routinely functioned for years. Opportunity operated for 14 years; Spirit for 6 years; Voyager in deep space for nearly 50 years.',
    metric: '5,111 Sols',
    metricLabel: 'Opportunity Active Lifetime',
    detail: 'Leaving equipment stationary on the surface allows scientists to measure multi-year weather cycles, seasonal frost transitions, cosmic ray bombardment, and long-term tectonic settling.'
  },
  {
    id: 'space-archaeology',
    title: 'Planetary Heritage & Archaeology',
    subtitle: 'Humanity\'s First Extraterrestrial Sites',
    summary: 'Discarded equipment isn\'t trash—it is humanity\'s shared cultural and scientific heritage. Tranquility Base and Endeavour Crater are the pyramids and stone circles of the space age.',
    metric: '1969',
    metricLabel: 'First Lunar Artifact Station',
    detail: 'International space archaeologists study how solar wind, extreme vacuum, and micrometeorites alter human materials over decades. Preserving these sites intact protects irreplaceable scientific benchmarks for future planetary explorers.'
  },
  {
    id: 'planetary-protection',
    title: 'Planetary Protection Protocols',
    subtitle: 'Preventing Biological Cross-Contamination',
    summary: 'Lifting off and returning dirty hardware to Earth or moving it between worlds carries complex bio-contamination risks governed by COSPAR guidelines.',
    metric: 'Category IV',
    metricLabel: 'Planetary Quarantine Standard',
    detail: 'Carefully parking rovers in biologically dry regions or allowing atmospheric entry ensures we do not contaminate potential Martian biospheres or introduce terrestrial microbes to fragile environments.'
  }
];
