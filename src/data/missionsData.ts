import { MissionArtifact, ConstellationNode, ConstellationLink, QuizQuestion, SourceRef } from '../types/mission';
import { NASA_PHOTOS } from '../assets/images';

// Citation helpers. Every artifact links to its NSSDCA catalogue entry and to the NASA photo used.
const nssdc = (id: string, name: string): SourceRef => ({
  label: `NSSDCA catalogue: ${name} (${id})`,
  url: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`,
});
const pds = (lid: string): SourceRef => ({
  label: `PDS context product: ${lid.split(':').pop()}`,
  url: `https://pds.nasa.gov/api/search/1/products/${lid}`,
});
const ntrs = (id: string, title: string): SourceRef => ({
  label: `NTRS ${id}: ${title}`,
  url: `https://ntrs.nasa.gov/citations/${id}`,
});
const nasaImage = (id: string): SourceRef => ({
  label: `NASA Image and Video Library: ${id}`,
  url: `https://images.nasa.gov/details/${id}`,
});

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
    statusDescription: 'Silent since contact with the Pathfinder lander was lost on 27 September 1997 (sol 83); the cause was never confirmed',
    locationName: 'Ares Vallis (Chryse Planitia)',
    coordinates: {
      lat: '19.33° N',
      lng: '33.55° W',
      latNum: 19.33,
      lngNum: -33.55,
    },
    role: 'Pioneering mobile Mars micro-rover',
    hook: "The size of a microwave oven and built to last 7 Martian days, it kept going for 83. Then the lander that carried its messages went quiet, and no one knows why.",
    story: 'Weighing only 11.5 kg (about the size of a microwave oven), Sojourner showed that a rover could explore Mars. Designed for only 7 Martian days (sols), it operated for 83 sols, circling the Pathfinder lander and analyzing rocks named Barnacle Bill and Yogi.',
    scienceContribution: [
      'First in-situ chemical analysis of Martian rocks using APXS',
      'Demonstrated autonomous hazard avoidance and rocker-bogie mobility',
      'Measured atmospheric dust opacity and wind drift'
    ],
    engineeringFeat: 'Pioneered the rocker-bogie suspension system that later carried Spirit, Opportunity, Curiosity, and Perseverance.',
    daysActive: 83,
    distanceTraveled: 'approx. 100 meters',
    image: NASA_PHOTOS.sojourner,
    imageCaption: 'Sojourner beside the "Rock Garden", photographed by the Pathfinder lander (1997)',
    imageNasaId: 'PIA04318',
    nssdcId: '1996-068A',
    leftBehind: '1997-07-04',
    lastContact: '1997-09-27',
    imageCredit: 'NASA/JPL',
    pdsLid: 'urn:nasa:pds:context:investigation:mission.mars_pathfinder',
    ntrs: { id: '20210003045', title: 'The Mars Pathfinder Mission and Science Results' },
    sources: [nssdc('1996-068A', 'Mars Pathfinder'), nasaImage('PIA04318'), pds('urn:nasa:pds:context:investigation:mission.mars_pathfinder'), ntrs('20210003045', 'The Mars Pathfinder Mission and Science Results')],
    whyLeftBehind: 'Pathfinder was designed as a one-way technology demonstration: it carried no rocket to leave Mars again.',
    subsystems: [
      { name: 'APXS Sensor', description: 'Alpha Particle X-ray Spectrometer deployed on rock faces', significance: 'Revealed silica-rich volcanic rocks similar to terrestrial andesites.' },
      { name: 'Rocker-Bogie Chassis', description: '6-wheel titanium cleated mobility suspension', significance: 'Could climb obstacles higher than its own wheel diameter.' },
      { name: 'GaAs Solar Array', description: '0.22 m² solar panel producing peak 16 Watts', significance: 'Survived extreme diurnal thermal swings between -80°C and 15°C.' }
    ],
    funFacts: [
      'Named after Sojourner Truth, the African American abolitionist and women\'s rights activist.',
      'Sent about 550 images back to Earth before falling silent.',
      'If it lost contact, its software told it to drive back towards the lander, so it may have ended its days circling the silent base station.'
    ]
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
    hook: "Built for 90 Martian days, it kept driving for more than 14 years and covered a marathon. Then a dust storm swallowed the sky, and more than 1,000 calls from Earth went unanswered.",
    story: 'Designed to survive 90 Martian days and travel 600 meters, Opportunity roamed Mars for over 14 years and covered a marathon distance of 45.16 kilometers. It found strong evidence that liquid, acidic water once soaked the Martian plains of Meridiani.',
    scienceContribution: [
      'Discovered hematite-rich mineral spherules nicknamed "blueberries"',
      'Confirmed ancient groundwater systems and past habitable environments',
      'Documented deep cross-bedding strata inside Victoria and Endeavour craters'
    ],
    engineeringFeat: 'Drove 45.16 kilometers on another world powered solely by solar panels periodically cleaned by Martian dust devils.',
    daysActive: 5111,
    distanceTraveled: '45.16 km (marathon record)',
    image: NASA_PHOTOS.opportunity,
    imageCaption: 'Self-portrait by Opportunity, January 2014',
    imageNasaId: 'PIA17759',
    nssdcId: '2003-032A',
    leftBehind: '2004-01-25',
    lastContact: '2018-06-10',
    imageCredit: 'NASA/JPL-Caltech/Cornell/Arizona State Univ.',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mer1',
    ntrs: { id: '20060030524', title: 'Overview of the Mars Exploration Rover Mission' },
    sources: [nssdc('2003-032A', 'Opportunity'), nasaImage('PIA17759'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mer1'), ntrs('20060030524', 'Overview of the Mars Exploration Rover Mission')],
    whyLeftBehind: 'Martian escape velocity is 5.03 km/s. Mars sample return requires dedicated ascent stages; Opportunity had no return propulsion.',
    subsystems: [
      { name: 'Pancam & Navcam', description: 'Stereoscopic high-resolution color camera mast', significance: 'Gave humanity panoramic eyes across hundreds of Martian vistas.' },
      { name: 'Mössbauer Spectrometer', description: 'Identified iron-bearing minerals in soil and bedrock', significance: 'Pinpointed jarosite, a sulfate mineral formed exclusively in water.' },
      { name: 'Rock Abrasion Tool (RAT)', description: 'Diamond-tipped grinder to scrape rock rinds', significance: 'Exposed pristine unweathered rock interiors.' }
    ],
    funFacts: [
            'Surfaced from an unexpected sand trap nicknamed "Purgatory Dune" after weeks of ground simulations.',
      'Last communication: 10 June 2018. NASA sent more than 1,000 recovery commands; on the final night in February 2019 the team played Billie Holiday’s “I’ll Be Seeing You”.'
    ],
    historicalQuote: {
      text: 'My battery is low and it is getting dark.',
      author: 'A journalist’s popular paraphrase of the final telemetry (not words the rover sent)'
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
      lat: '14.572° S',
      lng: '175.478° E',
      latNum: -14.572,
      lngNum: 175.478,
    },
    role: 'Robotic field geologist and crater explorer',
    hook: "When one wheel jammed, Spirit kept going and dragged it behind. The broken wheel scraped open the soil and uncovered silica about 90% pure, a sign of ancient hot springs.",
    story: 'Opportunity’s twin sister Spirit landed on the opposite side of Mars in rugged Gusev Crater. Even after its right-front wheel seized up in 2006, Spirit dragged the dead wheel across the soil. That dragging wheel scraped away topsoil to accidentally uncover 90% pure silica—the signature of ancient volcanic hot springs where microbial life could have thrived.',
    scienceContribution: [
      'Discovered hydrothermal volcanic deposits (silica) in Home Plate',
      'Climbed Husband Hill to map ancient impact basin morphology',
      'Filmed dust devils sweeping across Gusev Crater'
    ],
    engineeringFeat: 'Operated for more than 20 times its planned design lifetime despite mechanical wear and catastrophic terrain entrapment.',
    daysActive: 2210,
    distanceTraveled: '7.73 km',
    image: NASA_PHOTOS.spirit,
    imageCaption: "Spirit's own view beside Home Plate, sol 1809 (2009)",
    imageNasaId: 'PIA11804',
    nssdcId: '2003-027A',
    leftBehind: '2004-01-04',
    lastContact: '2010-03-22',
    imageCredit: 'NASA/JPL-Caltech',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mer2',
    ntrs: { id: '20060030524', title: 'Overview of the Mars Exploration Rover Mission' },
    sources: [nssdc('2003-027A', 'Spirit'), nasaImage('PIA11804'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mer2'), ntrs('20060030524', 'Overview of the Mars Exploration Rover Mission')],
    whyLeftBehind: 'Exploration rovers carry no launch propellant; they remain as monuments to human ingenuity at their final science coordinates.',
    subsystems: [
      { name: 'Microscopic Imager', description: 'Extreme close-up lens on robotic arm', significance: 'Revealed millimeter-scale sedimentary structures.' },
      { name: 'Mini-TES Spectrometer', description: 'Miniature Thermal Emission Spectrometer', significance: 'Surveyed mineral composition of rocks from hundreds of meters away.' }
    ],
    funFacts: [
      'Accidentally made its greatest discovery because of a broken wheel dragging through the sand.',
      'Named peaks in the Columbia Hills after the fallen astronauts of Space Shuttle Columbia STS-107.'
    ]
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
    hook: "Digging in the Martian arctic, it uncovered bright white patches that vanished within days: water ice. Then winter came and loaded it with frozen carbon dioxide.",
    story: 'Phoenix touched down on the frigid arctic plains of Mars. With its robotic arm, it scraped shallow trenches into the soil and exposed bright white patches that evaporated over several days—confirming they were water ice.',
    scienceContribution: [
      'First direct sample and confirmation of subsurface water ice on Mars',
      'Discovered perchlorate salts in Martian soil, an oxidizer and chemical energy source',
      'Observed snow falling from Martian cirrus clouds using laser LiDAR'
    ],
    engineeringFeat: 'Used pulsed descent thrusters to land gently on arctic terrain without creating deep landing trenches.',
    daysActive: 161,
    image: NASA_PHOTOS.phoenix,
    imageCaption: "Phoenix's solar panel and robotic arm on the Martian arctic plain (2008)",
    imageNasaId: 'PIA10793',
    nssdcId: '2007-034A',
    leftBehind: '2008-05-25',
    lastContact: '2008-11-02',
    imageCredit: 'NASA/JPL-Caltech/University of Arizona/Texas A&M University',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.phx',
    ntrs: { id: '20070034771', title: 'Mission Design Overview for the Phoenix Mars Scout Mission' },
    sources: [nssdc('2007-034A', 'Phoenix Mars Lander'), nasaImage('PIA10793'), pds('urn:nasa:pds:context:instrument_host:spacecraft.phx'), ntrs('20070034771', 'Mission Design Overview for the Phoenix Mars Scout Mission')],
    whyLeftBehind: 'Stationary landers have no propulsion to lift off; northern Martian winter encapsulates the craft in frozen CO2.',
    subsystems: [
      { name: 'TEGA Oven Suite', description: 'Thermal and Evolved-Gas Analyzer ovens', significance: 'Heated soil to 1000°C to release and analyze trapped water vapor.' },
      { name: 'Robotic Arm RA', description: '2.35m trenching scoop with motorized rasp', significance: 'Dug down through cement-hard permafrost.' }
    ],
    funFacts: [
      'The team named its trenches after fairy-tale characters, such as “Snow White”.',
      'Orbital images in 2010 suggested that at least one solar panel had broken under the weight of winter carbon-dioxide ice.'
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
    hook: "InSight did not look around. It listened. Its seismometer heard more than 1,300 marsquakes and impacts, enough to map the inside of Mars down to its liquid core.",
    story: 'Instead of looking at the surface, InSight checked the heartbeat and vital signs of Mars. It placed an ultra-sensitive seismometer directly onto the ground, listening to more than 1,300 marsquakes and meteorite impacts, mapping the crust, mantle, and molten liquid iron core.',
    scienceContribution: [
      'Detected over 1,318 Marsquakes up to magnitude 5',
      'Determined the precise size and liquid state of the Martian core (~1,830 km radius)',
      'Recorded real-time seismic waves from fresh meteorite impact craters'
    ],
    engineeringFeat: 'First mission to deploy an autonomous robotic grapple to lift instruments off a lander deck and set them onto an alien surface.',
    daysActive: 1440,
    image: NASA_PHOTOS.insight,
    imageCaption: "InSight's final selfie, solar panels thick with dust (2022)",
    imageNasaId: 'PIA25287',
    nssdcId: '2018-042A',
    leftBehind: '2018-11-26',
    lastContact: '2022-12-15',
    imageCredit: 'NASA/JPL-Caltech',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.insight',
    ntrs: { id: '20190000333', title: '2018 Mars InSight Mission Design and Navigation Overview' },
    sources: [nssdc('2018-042A', 'InSight'), nasaImage('PIA25287'), pds('urn:nasa:pds:context:instrument_host:spacecraft.insight'), ntrs('20190000333', '2018 Mars InSight Mission Design and Navigation Overview')],
    whyLeftBehind: 'Geophysical observatories are built to permanently monitor tectonic and thermal activity until environmental wear stops them.',
    subsystems: [
      { name: 'SEIS Seismometer', description: 'Ultra-shielded vacuum-enclosed seismic sensor', significance: 'Could detect ground vibrations smaller than the width of a hydrogen atom.' },
      { name: 'WTS Shield', description: 'Wind and Thermal Shield dome', significance: 'Protected SEIS from howling Martian winds and wild temperature shifts.' },
      { name: 'HP³ Heat Flow Probe', description: 'Self-hammering "mole" probe', significance: 'Taught engineers how difficult compacted Martian regolith is to penetrate.' }
    ],
    funFacts: [
      'Engineers used InSight\'s robotic scoop to trickle sand into the wind, letting gusts blow away dust from the solar panels to squeeze out extra months of life.',
      'In December 2022 NASA posted a farewell written in InSight’s voice, saying its power was very low and this might be its last image.'
    ]
  },
  {
    id: 'viking1',
    artifactId: 'ARCH/MARS/006',
    name: 'Viking 1 Lander',
    shortName: 'Viking 1',
    mission: 'Viking Project',
    destination: 'MARS',
    landingYear: 1976,
    lastContactYear: 1982,
    category: 'LANDER',
    status: 'HISTORIC',
    statusDescription: 'Commemorated as Thomas Mutch Memorial Station; permanently resting at Chryse Planitia',
    locationName: 'Chryse Planitia ("Plains of Gold")',
    coordinates: {
      lat: '22.27° N',
      lng: '47.95° W',
      latNum: 22.27,
      lngNum: -47.95,
    },
    role: 'First long-duration Mars lander and life-detection laboratory',
    hook: "It sent the first clear photograph from the surface of Mars, then ran humanity’s first biology experiments on another world. One wrong command ended six years of work.",
    story: 'On July 20, 1976, Viking 1 sent humanity\'s first clear panoramic photograph from the surface of Mars. For more than six years, it collected meteorological data, scooped Martian soil, and conducted humanity\'s first biological experiments on another world.',
    scienceContribution: [
      'First high-resolution surface panoramas and color imaging of Mars',
      'Conducted first automated biology and gas-exchange experiments on extraterrestrial soil',
      'First continuous multi-year Martian weather record (temperature, pressure, winds)'
    ],
    engineeringFeat: 'Powered by two Radioisotope Thermoelectric Generators (RTGs) which provided steady warmth and electricity in sub-zero cold.',
    daysActive: 2307,
    image: NASA_PHOTOS.viking1,
    imageCaption: 'First color image from the surface of Mars, taken by Viking Lander 1 (1976)',
    imageNasaId: 'PIA00563',
    nssdcId: '1975-075C',
    leftBehind: '1976-07-20',
    lastContact: '1982-11-11',
    imageCredit: 'NASA/JPL',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.vl1',
    ntrs: { id: '19770022101', title: 'Viking 75 project: Viking lander system primary mission performance report' },
    sources: [nssdc('1975-075C', 'Viking 1 Lander'), nasaImage('PIA00563'), pds('urn:nasa:pds:context:instrument_host:spacecraft.vl1'), ntrs('19770022101', 'Viking 75 project: Viking lander system primary mission performance report')],
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
    shortName: 'Eagle',
    mission: 'Apollo 11',
    destination: 'MOON',
    landingYear: 1969,
    lastContactYear: 1969,
    category: 'HISTORIC_SITE',
    status: 'HISTORIC',
    statusDescription: 'Historic archaeological monument at Tranquility Base; resting intact on the lunar regolith',
    locationName: 'Mare Tranquillitatis (Sea of Tranquility)',
    coordinates: {
      lat: '0.67416° N',
      lng: '23.47314° E',
      latNum: 0.67416,
      lngNum: 23.47314,
    },
    role: 'Lunar descent stage and launch platform',
    hook: "Armstrong flew its last minute by hand to dodge a field of boulders. Its lower half still stands where people first walked on another world.",
    story: 'When Neil Armstrong and Buzz Aldrin blasted off from the Moon on July 21, 1969, they left the lower portion of the Eagle lander behind. Its four spidery landing legs, gold Kapton foil, and stainless steel plaque reading "We came in peace for all mankind" remain exactly where humanity first stepped onto another celestial body.',
    scienceContribution: [
      'Enabled the first lunar rock and soil samples brought to Earth (21.5 kg)',
      'Deployed the Early Apollo Scientific Experiments Package (EASEP)',
      'Served as launch pad for first extraterrestrial liftoff'
    ],
    engineeringFeat: 'Throttleable descent rocket engine capable of throttling between 10% and 60% thrust to allow manual piloting around craters and boulder fields.',
    daysActive: 1,
    image: NASA_PHOTOS.apollo11Descent,
    imageCaption: 'Buzz Aldrin beside a landing leg of the Eagle descent stage (1969)',
    imageNasaId: 'as11-40-5902',
    nssdcId: '1969-059C',
    leftBehind: '1969-07-21',
    lastContact: '1969-07-21',
    imageCredit: 'NASA',
    pdsLid: 'urn:nasa:pds:context:investigation:mission.apollo_11',
    orbitalView: { image: NASA_PHOTOS.lrocApollo11, nasaId: 'PIA12909', caption: 'Tranquility Base from orbit (2009): LRO\'s camera picks out the Eagle descent stage and the laser retroreflector beside it.', credit: 'NASA/GSFC/Arizona State University (LROC)' },
    ntrs: { id: '19700008096', title: 'Apollo 11 mission report' },
    sources: [nssdc('1969-059C', 'Apollo 11 Lunar Module / EASEP'), nasaImage('as11-40-5902'), pds('urn:nasa:pds:context:investigation:mission.apollo_11'), ntrs('19700008096', 'Apollo 11 mission report'), nasaImage('PIA12909')],
    whyLeftBehind: 'Staging physics. Every kilogram lifted off the lunar surface requires exponentially more fuel; leaving the descent stage behind cut the ascent weight by half.',
    subsystems: [
      { name: 'Descent Propulsion System (DPS)', description: 'Hypergolic throttleable liquid engine', significance: 'First rocket engine that could be throttled in deep space to touch down gently.' },
      { name: 'Crushable Honeycomb Struts', description: 'Aluminum honeycomb shock absorbers inside landing gear', significance: 'Absorbed the touchdown kinetic impact without bouncing.' },
      { name: 'Commemorative Plaque', description: 'Stainless steel plaque bearing Earth hemispheres', significance: 'Historical artifact of peaceful global exploration.' }
    ],
    funFacts: [
      'Armstrong piloted the lander manually for the final 60 seconds because the computer was guiding them toward a boulder-strewn crater.',
      'The boots worn by the astronauts were also discarded on the surface to save weight for lunar rocks.'
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
    shortName: 'LRV',
    mission: 'Apollo 15',
    destination: 'MOON',
    landingYear: 1971,
    lastContactYear: 1971,
    category: 'ROVER',
    status: 'HISTORIC',
    statusDescription: 'Parked 300 meters east of the Falcon lunar module; remains parked on the plain of Hadley Rille',
    locationName: 'Hadley-Apennine Region (Hadley Rille)',
    coordinates: {
      lat: '26.13239° N',
      lng: '3.63330° E',
      latNum: 26.13239,
      lngNum: 3.6333,
    },
    role: 'First crewed electric planetary buggy',
    hook: "A car with no steering wheel, folded flat for the trip. Two astronauts drove it 27.8 km across the Moon, then left it parked for good beside Hadley Rille.",
    story: 'Nicknamed the "Moon Buggy," the Lunar Roving Vehicle transformed Apollo from short walking strolls into extensive geological field expeditions. Astronauts Dave Scott and Jim Irwin drove 27.8 kilometers, exploring the steep flanks of Mount Hadley Delta and the 300-meter-deep Hadley Rille canyon.',
    scienceContribution: [
      'Tripled the exploration radius of astronauts from 1 km to over 5 km',
      'Enabled discovery of the "Genesis Rock" (anorthosite dated to 4.1 billion years old)',
      'Carried 77 kg of lunar samples back to the ascent stage'
    ],
    engineeringFeat: 'Folded flat against the side of the Lunar Module and unfolded on the surface with a system of cables and hinges.',
    daysActive: 3,
    distanceTraveled: '27.76 km',
    image: NASA_PHOTOS.apollo15Lrv,
    imageCaption: 'James Irwin with the Lunar Roving Vehicle at Hadley-Apennine (1971)',
    imageNasaId: 'as15-86-11602',
    nssdcId: '1971-063C',
    leftBehind: '1971-08-02',
    lastContact: '1971-08-02',
    imageCredit: 'NASA',
    pdsLid: 'urn:nasa:pds:context:investigation:mission.apollo_15',
    ntrs: { id: '19720021182', title: 'Apollo 15 Mission Report' },
    sources: [nssdc('1971-063C', 'Apollo 15 Lunar Module / ALSEP'), nasaImage('as15-86-11602'), pds('urn:nasa:pds:context:investigation:mission.apollo_15'), ntrs('19720021182', 'Apollo 15 Mission Report')],
    whyLeftBehind: 'The LRV weighed 210 kg on Earth (35 kg in Moon gravity); lifting it back into lunar orbit was impossible with Apollo mass budgets.',
    subsystems: [
      { name: 'Woven Wire Mesh Wheels', description: 'Zinc-coated steel wire mesh with titanium chevrons', significance: 'Prevented rubber tires from bursting in vacuum and gripped fluffy regolith.' },
      { name: 'Four Independent DC Motors', description: '0.25 horsepower motor inside each wheel hub', significance: 'Could steer with front or rear wheels independently.' },
      { name: 'Color TV Camera Mast', description: 'Ground-controlled television camera', significance: 'Broadcast the first live liftoff of an Apollo ascent stage from the Moon.' }
    ],
    funFacts: [
      'Had no steering wheel—astronauts steered with a small T-handle joystick between their seats.',
      'On Apollo 17, astronaut Gene Cernan broke a fender and repaired it with lunar maps and duct tape.'
    ]
  },
  {
    id: 'alsep-instruments',
    artifactId: 'ARCH/MOON/003',
    name: 'Apollo ALSEP Science Stations',
    shortName: 'ALSEP',
    mission: 'Apollo 12, 14, 15, 16, 17',
    destination: 'MOON',
    landingYear: 1969,
    lastContactYear: 1977,
    category: 'INSTRUMENT',
    status: 'INACTIVE',
    statusDescription: 'Operated continuously until deliberately switched off by NASA in September 1977 due to budget constraints',
    locationName: 'Multiple Lunar Basins (Ocean of Storms, Fra Mauro, Hadley, Descartes, Taurus-Littrow)',
    coordinates: {
      lat: '3.0128° S',
      lng: '23.4219° W',
      latNum: -3.0128,
      lngNum: -23.4219,
    },
    role: 'Nuclear-powered automated lunar geophysical stations',
    hook: "Small nuclear generators kept these stations working day and night for up to eight years. They heard the Moon ring like a bell, until NASA switched them off in 1977.",
    story: 'The Apollo Lunar Surface Experiments Package (ALSEP) was a suite of scientific instruments left behind by astronauts. Powered by miniature SNAP-27 nuclear generators, these stations functioned around the clock for up to 8 years, transmitting seismic waves, solar wind data, and heat flow measurements back to Earth.',
    scienceContribution: [
      'Discovered deep Moonquakes triggered by Earth tidal gravity forces',
      'Confirmed the Moon has a small solid mantle and possibly partially molten core',
      'Measured the tenuous lunar atmosphere and charged solar wind ionosphere'
    ],
    engineeringFeat: 'Nuclear thermoelectric power generators withstood lunar day/night temperature swings of 300°C for nearly a decade.',
    daysActive: 2870,
    image: NASA_PHOTOS.alsep,
    imageCaption: 'Part of the Apollo 12 ALSEP deployed in the Ocean of Storms (1969)',
    imageNasaId: 'as12-47-6918',
    nssdcId: '1969-099C',
    leftBehind: '1969-11-19',
    lastContact: '1977-09-30',
    imageCredit: 'NASA',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.a12a',
    orbitalView: { image: NASA_PHOTOS.lrocApollo12, nasaId: 'PIA12922', caption: 'The Apollo 12 site in the Ocean of Storms from LRO\'s mapping orbit (2009). The descent stage is the dark spot near the centre.', credit: 'NASA/GSFC/Arizona State University (LROC)' },
    ntrs: { id: '19760072997', title: 'Apollo 12 Mission Report' },
    sources: [nssdc('1969-099C', 'Apollo 12 Lunar Module / ALSEP'), nasaImage('as12-47-6918'), pds('urn:nasa:pds:context:instrument_host:spacecraft.a12a'), ntrs('19760072997', 'Apollo 12 Mission Report'), nasaImage('PIA12922')],
    whyLeftBehind: 'Designed specifically as long-term stationary monitoring stations to observe the Moon continuously over years.',
    subsystems: [
      { name: 'Passive Seismic Experiment (PSE)', description: 'Three-component long-period seismometer', significance: 'Detected over 12,000 seismic events on the Moon.' },
      { name: 'SNAP-27 Radioisotope Generator', description: 'Plutonium-238 heat converted to 73W electricity', significance: 'Uninterrupted power throughout 14-day lunar nights.' },
      { name: 'Laser Ranging Retroreflector (LRRR)', description: 'Array of 100 quartz corner-cube prisms', significance: 'Still in use: observatories on Earth bounce lasers off it to measure the distance to the Moon.' }
    ],
    funFacts: [
      'While the electronic stations were turned off in 1977, the mirror retroreflectors need no electricity and are still used by scientists today.',
      'When Apollo ascent stages intentionally crashed into the Moon, the ALSEPs recorded the Moon "ringing like a bell" for hours.'
    ]
  },
  {
    id: 'surveyor3',
    artifactId: 'ARCH/MOON/004',
    name: 'Surveyor 3 Robot Lander',
    shortName: 'Surveyor 3',
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
    hook: "Two and a half years after it landed, Apollo 12 touched down 160 metres away. The astronauts walked over and took parts of it home: the first visit to an old spacecraft on another world.",
    story: 'Surveyor 3 landed on the Moon in April 1967 to prove the lunar surface was firm enough for human astronauts. Two and a half years later, Apollo 12 executed a pinpoint landing only 160 meters away. Pete Conrad and Alan Bean walked over to Surveyor 3, inspected its weathered parts, and clipped off its TV camera and mechanical scoop to bring back to Earth: the first time people went back to an earlier spacecraft on another world.',
    scienceContribution: [
      'Proved lunar regolith could support the weight of heavy manned landers',
      'Conducted first mechanical digging and bearing-strength tests',
      'Enabled first forensic analysis of human-made materials exposed to deep space radiation and micrometeroids for 2.5 years'
    ],
    engineeringFeat: 'Executed closed-loop radar-guided retro-rocket landing inside a lunar crater.',
    daysActive: 14,
    image: NASA_PHOTOS.surveyor3,
    imageCaption: 'Alan Bean at Surveyor 3, with the Apollo 12 lunar module in the background (1969)',
    imageNasaId: 'AS12-48-7133',
    nssdcId: '1967-035A',
    leftBehind: '1967-04-20',
    lastContact: '1967-05-04',
    imageCredit: 'NASA',
    orbitalView: { image: NASA_PHOTOS.lrocApollo12, nasaId: 'PIA12922', caption: 'The Apollo 12 site in the Ocean of Storms from LRO\'s mapping orbit (2009). The descent stage is the dark spot near the centre.', credit: 'NASA/GSFC/Arizona State University (LROC)' },
    ntrs: { id: '19670028267', title: 'Surveyor III mission report. Part I - Mission description and performance' },
    sources: [nssdc('1967-035A', 'Surveyor 3'), nasaImage('AS12-48-7133'), ntrs('19670028267', 'Surveyor III mission report. Part I - Mission description and performance'), nasaImage('PIA12922')],
    whyLeftBehind: 'Precursor missions were expendable scouts designed to prepare the path for the Apollo landings.',
    subsystems: [
      { name: 'Surface Sampler Scoop', description: 'Motorized pantograph digging bucket', significance: 'Dug four trenches up to 17.5 cm deep into lunar soil.' },
      { name: 'Vidicon Television Camera', description: 'Scanning mirror television transmitter', significance: 'Retrieved by Apollo 12; now preserved in the Smithsonian National Air and Space Museum.' }
    ],
    funFacts: [
      'Bacteria reported in the returned camera in 1970 were later judged most likely to be contamination from Earth, not microbes that survived on the Moon.',
      'Pete Conrad took a famous photograph of Alan Bean standing beside Surveyor 3 with the Intrepid lunar module in the background.'
    ]
  },

  // STILL ACTIVE: hardware that is still in use today
  {
    id: 'apollo11-lrrr',
    artifactId: 'ARCH/MOON/005',
    name: 'Apollo 11 Laser Ranging Retroreflector',
    shortName: 'Retroreflector',
    mission: 'Apollo 11 (EASEP)',
    destination: 'MOON',
    landingYear: 1969,
    lastContactYear: 'In use today',
    category: 'INSTRUMENT',
    status: 'ACTIVE',
    statusDescription: 'Still in use: observatories on Earth bounce laser pulses off it to measure the Earth–Moon distance',
    locationName: 'Mare Tranquillitatis (Tranquility Base)',
    coordinates: {
      lat: '0.67416° N',
      lng: '23.47314° E',
      latNum: 0.67416,
      lngNum: 23.47314,
    },
    role: 'Passive mirror array for lunar laser ranging',
    hook: "No power, no moving parts, and still at work. Telescopes on Earth fire lasers at it and catch the echo, counting the returning light one photon at a time.",
    story: 'Buzz Aldrin set this panel of 100 fused-silica corner-cube prisms on the lunar surface a few metres from the Eagle lander. It needs no power and has no moving parts. More than half a century later, telescopes on Earth still fire laser pulses at it and time the faint echo, turning a 1969 artifact into a working scientific instrument.',
    scienceContribution: [
      'Measures the Earth–Moon distance by timing laser echoes',
      'Showed that the Moon is slowly moving away from Earth',
      'Provides precise tests of gravity and General Relativity'
    ],
    engineeringFeat: 'A completely passive instrument: corner-cube prisms reflect light straight back to its source, whatever angle it arrives from.',
    daysActive: '57+ years',
    image: NASA_PHOTOS.apollo11Lrrr,
    imageCaption: 'Buzz Aldrin beside the deployed Early Apollo Scientific Experiments Package, which included the laser retroreflector (1969)',
    imageNasaId: 'as11-40-5948',
    nssdcId: '1969-059C',
    leftBehind: '1969-07-21',
    lastContact: null,
    imageCredit: 'NASA',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.a11e',
    orbitalView: { image: NASA_PHOTOS.lrocApollo11, nasaId: 'PIA12909', caption: 'Tranquility Base from orbit (2009): LRO\'s camera picks out the Eagle descent stage and the laser retroreflector beside it.', credit: 'NASA/GSFC/Arizona State University (LROC)' },
    ntrs: { id: '19700058647', title: 'The Apollo 11 laser ranging retro-reflector array' },
    sources: [nssdc('1969-059C', 'Apollo 11 Lunar Module / EASEP'), nasaImage('as11-40-5948'), pds('urn:nasa:pds:context:instrument_host:spacecraft.a11e'), ntrs('19700058647', 'The Apollo 11 laser ranging retro-reflector array'), nasaImage('PIA12909')],
    whyLeftBehind: 'It was designed to stay. A retroreflector only works where it is: on the Moon, pointed at Earth.',
    subsystems: [
      { name: 'Corner-Cube Array', description: '100 fused-silica corner-cube prisms in an aluminium panel', significance: 'Returns a laser pulse back towards the telescope that sent it.' },
      { name: 'Passive Design', description: 'No electronics, batteries or moving parts', significance: 'The reason it still works more than five decades later.' }
    ],
    funFacts: [
      'Apollo 14 and Apollo 15 left similar arrays; the Apollo 15 array is the largest, with 300 prisms.',
      'Only a tiny fraction of each laser pulse makes it back to Earth, so observatories count returning photons one by one.'
    ]
  },
  {
    id: 'curiosity',
    artifactId: 'ARCH/MARS/007',
    name: 'Curiosity Rover',
    mission: 'Mars Science Laboratory',
    destination: 'MARS',
    landingYear: 2012,
    lastContactYear: 'Active',
    category: 'ROVER',
    status: 'ACTIVE',
    statusDescription: 'Still driving and returning images and science data from Gale Crater',
    locationName: 'Gale Crater (Bradbury Landing site)',
    coordinates: {
      lat: '4.59° S',
      lng: '137.44° E',
      latNum: -4.59,
      lngNum: 137.44,
    },
    role: 'Nuclear-powered mobile geochemistry laboratory',
    hook: "A rocket-powered sky crane lowered it onto Mars. It found that Gale Crater once held a lake microbes could have lived in, and it is still climbing Mount Sharp today.",
    story: 'Curiosity landed in Gale Crater in August 2012, lowered onto the surface by a rocket-powered "sky crane". It soon found that the crater once held a lake with water that microbes could have lived in. It is still climbing the layered slopes of Mount Sharp, reading billions of years of Martian climate history layer by layer. It shows what the silent machines in this archive were like while they were still working.',
    scienceContribution: [
      'Showed that Gale Crater once held a long-lived lake that could have supported microbial life',
      'Detected complex organic molecules preserved in ancient mudstone',
      'Measured the radiation environment future astronauts will face on Mars'
    ],
    engineeringFeat: 'First rover delivered by a sky crane, and powered by a radioisotope generator instead of solar panels, so dust cannot shut it down.',
    daysActive: '5,000+ sols',
    image: NASA_PHOTOS.curiosity,
    imageCaption: 'Curiosity selfie at the "Mary Anning" drill site (2020)',
    imageNasaId: 'PIA24173',
    nssdcId: '2011-070A',
    leftBehind: '2012-08-06',
    lastContact: null,
    imageCredit: 'NASA/JPL-Caltech/MSSS',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.msl',
    ntrs: { id: '20120009875', title: "An Overview of NASA's Mars Science Laboratory" },
    sources: [nssdc('2011-070A', 'Mars Science Laboratory (MSL)'), nasaImage('PIA24173'), pds('urn:nasa:pds:context:instrument_host:spacecraft.msl'), ntrs('20120009875', "An Overview of NASA's Mars Science Laboratory")],
    whyLeftBehind: 'Not left behind yet. Like every Mars rover, it carries no return rocket and will one day become a silent monument where it stops.',
    subsystems: [
      { name: 'MMRTG Power Source', description: 'Multi-Mission Radioisotope Thermoelectric Generator', significance: 'Steady power through dust storms and winters that ended solar-powered missions.' },
      { name: 'SAM & CheMin Labs', description: 'Onboard chemistry and mineralogy laboratories', significance: 'Analyse drilled rock powder directly on Mars.' },
      { name: 'ChemCam Laser', description: 'Laser that vaporises rock from metres away', significance: 'Reads the chemistry of targets the arm cannot reach.' }
    ],
    funFacts: [
      'Curiosity takes its selfies by stitching together dozens of images from the camera on its robotic arm.',
      'It is about the size of a small car, roughly five times heavier than Spirit or Opportunity.'
    ]
  },
  {
    id: 'perseverance',
    artifactId: 'ARCH/MARS/008',
    name: 'Perseverance Rover',
    mission: 'Mars 2020',
    destination: 'MARS',
    landingYear: 2021,
    lastContactYear: 'Active',
    category: 'ROVER',
    status: 'ACTIVE',
    statusDescription: 'Still exploring Jezero Crater and collecting rock samples',
    locationName: 'Jezero Crater (Octavia E. Butler Landing)',
    coordinates: {
      lat: '18.44° N',
      lng: '77.45° E',
      latNum: 18.44,
      lngNum: 77.45,
    },
    role: 'Astrobiology explorer and sample collector',
    hook: "It seals rock cores in tubes for a possible trip back to Earth. It also brought a helicopter, which became the first aircraft to fly on another planet.",
    story: 'Perseverance landed in Jezero Crater, an ancient river delta, in February 2021. It searches for signs of past microbial life and seals promising rock cores in tubes for a possible future return to Earth. It carried the Ingenuity helicopter, which made the first powered, controlled flight on another planet. Ingenuity has since become a piece of abandoned hardware itself.',
    scienceContribution: [
      'Collected sealed rock and soil cores for possible return to Earth',
      'Explored the delta deposits of an ancient Martian lake',
      'Found the "Cheyava Falls" rock, whose features are being studied as possible signs of ancient life'
    ],
    engineeringFeat: 'Carried MOXIE, which made oxygen from the Martian atmosphere, and Ingenuity, the first aircraft to fly on another planet.',
    daysActive: '2,000+ sols',
    image: NASA_PHOTOS.perseverance,
    imageCaption: 'Perseverance with the Ingenuity helicopter in the background (2021)',
    imageNasaId: 'PIA24542',
    nssdcId: '2020-052A',
    leftBehind: '2021-02-18',
    lastContact: null,
    imageCredit: 'NASA/JPL-Caltech/MSSS',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mars2020',
    ntrs: { id: '20190000332', title: 'Mars 2020 Mission Design and Navigation Overview' },
    sources: [nssdc('2020-052A', 'Mars 2020'), nasaImage('PIA24542'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mars2020'), ntrs('20190000332', 'Mars 2020 Mission Design and Navigation Overview')],
    whyLeftBehind: 'Not left behind yet. Its samples may come home, but the rover itself will stay on Mars.',
    subsystems: [
      { name: 'Sample Caching System', description: 'Drill, robotic arm and sealed sample tubes', significance: 'The first step towards bringing Martian rock back to Earth.' },
      { name: 'Ingenuity Helicopter', description: '1.8 kg solar-powered rotorcraft', significance: 'Proved that powered flight is possible in Mars\'s thin air.' },
      { name: 'MOXIE', description: 'Oxygen generator experiment', significance: 'Turned Martian carbon dioxide into breathable oxygen.' }
    ],
    funFacts: [
      'Ingenuity was planned for 5 flights and made 72 before rotor damage ended its mission in 2024.',
      'The landing site is named after science-fiction author Octavia E. Butler.'
    ]
  },

  // LOST: contact lost during arrival
  {
    id: 'mars-polar-lander',
    artifactId: 'ARCH/MARS/009',
    name: 'Mars Polar Lander',
    shortName: 'Polar Lander',
    mission: 'Mars Surveyor 98',
    destination: 'MARS',
    landingYear: 1999,
    lastContactYear: 1999,
    category: 'LANDER',
    status: 'LOST',
    statusDescription: 'Contact lost during descent on 3 December 1999; its fate has never been confirmed',
    locationName: 'Planum Australe, south polar layered terrain (target site)',
    coordinates: {
      lat: '76° S',
      lng: '195° W',
      latNum: -76,
      lngNum: 165,
    },
    role: 'Polar lander to search for water ice and study the climate',
    hook: "It went quiet as planned before landing and never spoke again. The leading theory: a jolt from its own legs fooled the software, and the engines cut out about 40 metres up.",
    story: 'Mars Polar Lander was meant to be the first spacecraft to land near a Martian pole. On 3 December 1999 it went silent as planned before entering the atmosphere and was never heard from again. The leading explanation is that the landing legs jolted open, the software read that jolt as touchdown, and the engines shut off while the lander was still about 40 metres up. Its remains have never been confirmed in orbital images.',
    scienceContribution: [
      'Its loss led to stricter testing of landing software and touchdown sensors',
      'Lessons from it shaped Phoenix, which landed safely near the north pole in 2008',
      'Showed how much the success of a mission depends on its final minutes'
    ],
    engineeringFeat: 'Carried two Deep Space 2 microprobes designed to slam into the ground and measure the soil; they were lost too.',
    daysActive: 0,
    image: NASA_PHOTOS.marsPolarLander,
    imageCaption: 'Mars Polar Lander being prepared for launch at Kennedy Space Center (1998)',
    imageNasaId: 'KSC-98pc1212',
    nssdcId: '1999-001A',
    leftBehind: '1999-12-03',
    lastContact: '1999-12-03',
    imageCredit: 'NASA/KSC',
    ntrs: { id: '20000061966', title: 'Report on the Loss of the Mars Polar Lander and Deep Space 2 Missions' },
    sources: [nssdc('1999-001A', 'Mars Polar Lander'), nasaImage('KSC-98pc1212'), ntrs('20000061966', 'Report on the Loss of the Mars Polar Lander and Deep Space 2 Missions')],
    whyLeftBehind: 'It was never meant to come back, and its loss means no one knows exactly where it lies or in what condition.',
    subsystems: [
      { name: 'Touchdown Sensors', description: 'Leg sensors meant to stop the engines at contact', significance: 'Most likely failure point: a false signal when the legs deployed.' },
      { name: 'Robotic Arm & Camera', description: 'Arm to dig into the polar layered terrain', significance: 'Planned to look for water ice and record the climate history in the layers.' }
    ],
    funFacts: [
      'Orbiting cameras have searched the target area many times without confirming the wreckage.',
      'Phoenix (2008) reused hardware and lessons from this programme and succeeded.'
    ]
  },
  // ADDED v0.8: landers that went quiet, jettisoned entry hardware, impact sites, the first Mars aircraft
  {
    id: 'viking2',
    artifactId: 'ARCH/MARS/010',
    name: 'Viking 2 Lander',
    shortName: 'Viking 2',
    mission: 'Viking Project',
    destination: 'MARS',
    landingYear: 1976,
    lastContactYear: 1980,
    category: 'LANDER',
    status: 'SILENT',
    statusDescription: 'Turned off on 11 April 1980 when its batteries failed, after 1,281 Mars days on the surface',
    locationName: 'Utopia Planitia (about 200 km west of Mie crater)',
    coordinates: {
      lat: '47.6673° N',
      lng: '134.2809° E',
      latNum: 47.6673,
      lngNum: 134.2809,
    },
    role: 'Second Viking lander and long-term weather station',
    hook: "It landed on the far side of Mars from its twin and watched the seasons turn for more than three years. One winter it photographed a thin layer of frost on the ground.",
    story: "Viking 2 landed on the far side of Mars from its twin, on the rock-strewn plains of Utopia Planitia. For more than three Earth years it measured the weather, searched the soil for signs of life and watched the seasons change. In the northern winter its cameras photographed a thin layer of water frost on the ground around it, one of the most famous pictures ever sent from Mars.",
    scienceContribution: [
      'Photographed seasonal water frost on the Martian surface',
      'Ran the second set of Viking life-detection experiments on Martian soil',
      'Recorded more than three Earth years of weather at a high northern latitude'
    ],
    engineeringFeat: 'Powered by two plutonium-238 radioisotope generators, so it kept working through the dark Martian winters.',
    daysActive: 1281,
    image: NASA_PHOTOS.viking2,
    imageCaption: 'Frost on the rocks around Viking Lander 2 in Utopia Planitia',
    imageNasaId: 'PIA00571',
    nssdcId: '1975-083C',
    leftBehind: '1976-09-03',
    lastContact: '1980-04-11',
    imageCredit: 'NASA/JPL',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.vl2',
    ntrs: { id: '19770022101', title: 'Viking 75 project: Viking lander system primary mission performance report' },
    sources: [nssdc('1975-083C', 'Viking 2 Lander'), nasaImage('PIA00571'), pds('urn:nasa:pds:context:instrument_host:spacecraft.vl2'), ntrs('19770022101', 'Viking 75 project: Viking lander system primary mission performance report')],
    whyLeftBehind: 'Like Viking 1, it was a stationary science station with no rocket to leave Mars.',
    subsystems: [
      { name: 'Twin Facsimile Cameras', description: 'Two scanning cameras on the lander deck', significance: 'Recorded the frost, dust and changing light of a Martian year.' },
      { name: 'Meteorology Boom', description: 'Temperature, pressure and wind sensors', significance: 'Built one of the longest weather records from the Martian surface.' }
    ],
    funFacts: [
      'Its landing radar mistook a rock for the ground, so the lander touched down tilted by about 8 degrees.',
      'Viking 1 and Viking 2 landed on opposite sides of Mars, about 6,500 km apart.'
    ]
  },
  {
    id: 'opportunity-heatshield',
    artifactId: 'ARCH/MARS/011',
    name: "Opportunity's Heat Shield",
    shortName: 'Heat shield',
    mission: 'Mars Exploration Rover',
    destination: 'MARS',
    landingYear: 2004,
    lastContactYear: 'Never transmitted',
    category: 'ENTRY_HARDWARE',
    status: 'HISTORIC',
    statusDescription: 'Jettisoned during descent; the rover later drove back to inspect it in December 2004',
    locationName: 'Meridiani Planum, near the landing site (position approximate)',
    coordinates: {
      lat: '≈ 1.95° S',
      lng: '≈ 5.53° W',
      latNum: -1.95,
      lngNum: -5.53,
    },
    role: 'Thermal protection that shielded the rover through atmospheric entry',
    hook: "It took the heat so Opportunity could land, then fell away. Eleven months later the rover drove back to find it, and nearby found the first meteorite ever identified on another planet.",
    story: "Before Opportunity could land, its heat shield had to survive a fiery plunge through the Martian atmosphere, then fall away. Eleven months later the rover drove back to find it, crumpled and turned inside out on the plain. Engineers used its photographs to see how the shield had performed. Nearby, the rover found a basketball-sized iron rock, the first meteorite ever identified on another planet, nicknamed Heat Shield Rock.",
    scienceContribution: [
      'Gave engineers a close look at how a heat shield survives Mars entry',
      'Led the rover to Heat Shield Rock, the first meteorite identified on another planet',
      'Showed how discarded hardware can still teach lessons for future landers'
    ],
    engineeringFeat: 'Protected the rover from the heat of entry, then separated cleanly so the parachute and airbags could do their work.',
    daysActive: 'Minutes (entry)',
    image: NASA_PHOTOS.opportunityHeatShield,
    imageCaption: "Opportunity's crumpled heat shield, photographed by the rover on sol 325 (2004)",
    imageNasaId: 'PIA07223',
    nssdcId: '2003-032A',
    leftBehind: '2004-01-25',
    lastContact: '2004-01-25',
    imageCredit: 'NASA/JPL/Cornell',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mer1',
    ntrs: { id: '20060030524', title: 'Overview of the Mars Exploration Rover Mission' },
    sources: [nssdc('2003-032A', 'Opportunity'), nasaImage('PIA07223'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mer1'), ntrs('20060030524', 'Overview of the Mars Exploration Rover Mission')],
    whyLeftBehind: 'A heat shield is designed to be thrown away: once entry is over it is dead weight, so it is released in mid-air.',
    subsystems: [
      { name: 'Ablative Heat Shield', description: 'Protective layer that burns away slowly during entry', significance: 'Carries heat away from the spacecraft.' }
    ],
    funFacts: [
      'Heat Shield Rock is an iron-nickel meteorite, found in January 2005.'
    ]
  },
  {
    id: 'perseverance-backshell',
    artifactId: 'ARCH/MARS/012',
    name: "Perseverance's Backshell and Parachute",
    shortName: 'Backshell',
    mission: 'Mars 2020',
    destination: 'MARS',
    landingYear: 2021,
    lastContactYear: 'Never transmitted',
    category: 'ENTRY_HARDWARE',
    status: 'HISTORIC',
    statusDescription: 'Discarded during landing; photographed from the air by the Ingenuity helicopter in April 2022',
    locationName: 'Jezero Crater, near the rover landing site (position approximate)',
    coordinates: {
      lat: '≈ 18.44° N',
      lng: '≈ 77.45° E',
      latNum: 18.44,
      lngNum: 77.45,
    },
    role: 'Upper half of the entry capsule, carrying the parachute',
    hook: "Its parachute hid a message in binary code. Fourteen months after landing, a helicopter flew over and photographed the wreck lying on the crater floor.",
    story: "The backshell protected Perseverance on its way to Mars and held the 21.5-metre parachute that slowed its fall. After the rover was lowered away, the backshell and parachute crashed onto the crater floor. Fourteen months later the Ingenuity helicopter flew over and photographed them: the shell sitting upright, cables trailing, the parachute spread across the ground. Engineers studied the pictures to design future landings, including the plan to bring Martian samples home.",
    scienceContribution: [
      'First aerial photographs of landing hardware on another planet',
      'Helped engineers check how the parachute and backshell performed',
      'Informed the design of future Mars landers and the Mars Sample Return plan'
    ],
    engineeringFeat: 'Its supersonic parachute, 21.5 m across, was the largest ever flown to Mars at the time.',
    daysActive: 'Minutes (entry and descent)',
    image: NASA_PHOTOS.perseveranceBackshell,
    imageCaption: "Perseverance's backshell on the floor of Jezero Crater, seen by Ingenuity from 8 m up (2022)",
    imageNasaId: 'PIA25219',
    nssdcId: '2020-052A',
    leftBehind: '2021-02-18',
    lastContact: '2021-02-18',
    imageCredit: 'NASA/JPL-Caltech',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mars2020',
    ntrs: { id: '20210006842', title: 'Mars 2020 Entry, Descent, and Landing system overview' },
    sources: [nssdc('2020-052A', 'Mars 2020'), nasaImage('PIA25219'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mars2020'), ntrs('20210006842', 'Mars 2020 Entry, Descent, and Landing system overview')],
    whyLeftBehind: 'Entry hardware only has to work for a few minutes. Once the rover is safely down, the backshell and parachute are no longer needed.',
    subsystems: [
      { name: 'Supersonic Parachute', description: '21.5 m disk-gap-band parachute', significance: 'Slowed the capsule from supersonic speed in the thin Martian air.' },
      { name: 'Backshell', description: 'Upper cone of the entry capsule', significance: 'Protected the rover and carried the parachute and descent stage.' }
    ],
    funFacts: [
      'The parachute carried a hidden message in binary code: "Dare mighty things".'
    ]
  },
  {
    id: 'ingenuity',
    artifactId: 'ARCH/MARS/013',
    name: 'Ingenuity Mars Helicopter',
    shortName: 'Ingenuity',
    mission: 'Mars 2020',
    destination: 'MARS',
    landingYear: 2021,
    lastContactYear: 2024,
    category: 'AIRCRAFT',
    status: 'INACTIVE',
    statusDescription: 'Flight mission ended in January 2024 after rotor damage on its 72nd flight; it rests at "Valinor Hills"',
    locationName: '"Valinor Hills", Jezero Crater (position approximate)',
    coordinates: {
      lat: '≈ 18.44° N',
      lng: '≈ 77.45° E',
      latNum: 18.44,
      lngNum: 77.45,
    },
    role: 'First aircraft to make a powered, controlled flight on another world',
    hook: "Planned for five flights, it flew 72, in air about one per cent as thick as Earth’s. It carries a scrap of fabric from the Wright brothers’ first airplane.",
    story: "Ingenuity rode to Mars under Perseverance's belly and was meant to fly just five times. It flew 72. It scouted routes for the rover, photographed its own landing hardware and proved that flight is possible in air about one per cent as dense as Earth's. On 18 January 2024 it landed hard and damaged its rotor blades. Perseverance photographed it weeks later, a tiny figure among the sand ripples at the spot the team named Valinor Hills.",
    scienceContribution: [
      'Proved powered, controlled flight is possible on Mars',
      'Scouted terrain ahead of the Perseverance rover',
      'Took the aerial photos of Perseverance\'s parachute and backshell'
    ],
    engineeringFeat: 'Its two rotors spun at about 2,400 revolutions per minute to lift a 1.8 kg aircraft in very thin air.',
    daysActive: '72 flights',
    image: NASA_PHOTOS.ingenuity,
    imageCaption: 'Ingenuity at "Valinor Hills" (just left of centre), photographed by Perseverance in February 2024',
    imageNasaId: 'PIA26237',
    nssdcId: '2020-052A',
    leftBehind: '2024-01-18',
    lastContact: null,
    imageCredit: 'NASA/JPL-Caltech/ASU/MSSS',
    pdsLid: 'urn:nasa:pds:context:instrument_host:spacecraft.mars2020',
    ntrs: { id: '20220001219', title: 'Ingenuity Mars Helicopter Technology Demonstration' },
    sources: [nssdc('2020-052A', 'Mars 2020'), nasaImage('PIA26237'), pds('urn:nasa:pds:context:instrument_host:spacecraft.mars2020'), ntrs('20220001219', 'Ingenuity Mars Helicopter Technology Demonstration')],
    whyLeftBehind: 'Ingenuity was a technology demonstration with no way to leave Mars. With damaged blades it can no longer fly, so it stays where it last landed.',
    subsystems: [
      { name: 'Coaxial Rotors', description: 'Two counter-rotating carbon-fibre rotors', significance: 'Produced enough lift in the thin Martian atmosphere.' },
      { name: 'Solar Panel', description: 'Small panel above the rotors', significance: 'Recharged the batteries between flights.' }
    ],
    funFacts: [
      'It carries a small piece of fabric from the Wright brothers\' 1903 Flyer.',
      'Its first flight, on 19 April 2021, lasted under a minute and changed what we thought was possible on Mars.'
    ]
  },
  {
    id: 'apollo17-challenger',
    artifactId: 'ARCH/MOON/006',
    name: 'Apollo 17 Challenger Descent Stage and Rover',
    shortName: 'Apollo 17',
    mission: 'Apollo 17',
    destination: 'MOON',
    landingYear: 1972,
    lastContactYear: 1972,
    category: 'HISTORIC_SITE',
    status: 'HISTORIC',
    statusDescription: 'Site of the last crewed landing on the Moon; the descent stage, rover and science station remain in the Taurus-Littrow valley',
    locationName: 'Taurus-Littrow valley, Mare Serenitatis',
    coordinates: {
      lat: '20.1911° N',
      lng: '30.7723° E',
      latNum: 20.1911,
      lngNum: 30.7723,
    },
    role: 'Lunar module descent stage, lunar rover and launch platform of the final Apollo mission',
    hook: "The last place people stood on the Moon. Here a geologist found orange soil made of ancient volcanic glass, and a plaque marks the end of humanity’s first explorations.",
    story: "Apollo 17 was the last time humans walked on the Moon. Eugene Cernan and Harrison Schmitt, a geologist, spent three days in the Taurus-Littrow valley and drove their rover to explore boulders and craters. Schmitt discovered a patch of orange soil, formed from ancient volcanic glass. When they lifted off on 14 December 1972, they left the Challenger descent stage, the rover and a science station behind, with a plaque marking the end of humanity's first explorations of the Moon.",
    scienceContribution: [
      'Discovered orange volcanic glass soil at Shorty crater',
      'Returned the largest sample collection of any Apollo mission',
      'Brought the first professional geologist to the Moon'
    ],
    engineeringFeat: 'The longest Apollo surface stay, with three moonwalks supported by the third and last Lunar Roving Vehicle.',
    daysActive: 3,
    image: NASA_PHOTOS.apollo17,
    imageCaption: 'Harrison Schmitt by the flag, with the Challenger lunar module (left) and the rover (right), 1972',
    imageNasaId: 'as17-134-20382',
    nssdcId: '1972-096C',
    leftBehind: '1972-12-14',
    lastContact: '1972-12-14',
    imageCredit: 'NASA',
    pdsLid: 'urn:nasa:pds:context:investigation:mission.apollo_17',
    orbitalView: { image: NASA_PHOTOS.lrocApollo17, nasaId: 'PIA12920', caption: 'The Challenger descent stage seen from orbit by LRO (2009); the flag is marked above it.', credit: 'NASA/GSFC/Arizona State University (LROC)' },
    ntrs: { id: '19730015117', title: 'Apollo 17 Mission Report' },
    sources: [nssdc('1972-096C', 'Apollo 17 Lunar Module /ALSEP'), nasaImage('as17-134-20382'), nasaImage('PIA12920'), pds('urn:nasa:pds:context:investigation:mission.apollo_17'), ntrs('19730015117', 'Apollo 17 Mission Report')],
    whyLeftBehind: 'As on every Apollo landing, the descent stage served as the launch pad, and the rover was far too heavy to bring home.',
    subsystems: [
      { name: 'Descent Stage', description: 'Lower half of the lunar module Challenger', significance: 'Landed the crew and became their launch platform.' },
      { name: 'Lunar Roving Vehicle', description: 'The third and final Apollo rover', significance: 'Carried the crew to sites kilometres from the lander.' }
    ],
    funFacts: [
      'Eugene Cernan was the last person to walk on the Moon.',
      'The plaque on the descent stage says humans completed their first explorations of the Moon here in December 1972.'
    ]
  },
  {
    id: 'apollo14-sivb',
    artifactId: 'ARCH/MOON/007',
    name: 'Apollo 14 S-IVB Impact Crater',
    shortName: 'S-IVB crater',
    mission: 'Apollo 14',
    destination: 'MOON',
    landingYear: 1971,
    lastContactYear: 1971,
    category: 'IMPACT_SITE',
    status: 'HISTORIC',
    statusDescription: 'Crater made when the third stage of the Apollo 14 Saturn V was deliberately crashed into the Moon',
    locationName: 'South of Lansberg crater region, Mare Insularum',
    coordinates: {
      lat: '8.1810° S',
      lng: '26.0305° W',
      latNum: -8.181,
      lngNum: -26.0305,
    },
    role: 'Spent rocket stage used as an artificial moonquake',
    hook: "This crater was made on purpose. A spent Saturn V stage was steered into the Moon at about 2.5 km/s, and a seismometer 170 km away felt the Moon shake.",
    story: "After sending Apollo 14 towards the Moon, the empty third stage of its Saturn V rocket was steered onto a collision course. On 4 February 1971 it struck the surface at about 2.54 km per second. The impact shook the Moon, and the seismometer the Apollo 12 crew had left 170 km away recorded it, letting scientists probe the Moon's interior. Decades later, LRO photographed the bright crater it left.",
    scienceContribution: [
      'Gave a known, timed seismic source for the Apollo seismometers',
      'Helped scientists measure the structure of the Moon\'s crust',
      'Showed how rocket stages can be reused as science tools'
    ],
    engineeringFeat: 'Aimed across 380,000 km of space so its impact landed close enough to the Apollo 12 seismometer to be measured.',
    daysActive: 'Impact',
    image: NASA_PHOTOS.apollo14Sivb,
    imageCaption: 'The bright crater left by the Apollo 14 S-IVB, photographed by LRO (2009)',
    imageNasaId: 'PIA12911',
    nssdcId: '1971-008B',
    leftBehind: '1971-02-04',
    lastContact: '1971-02-04',
    imageCredit: 'NASA/GSFC/Arizona State University',
    pdsLid: 'urn:nasa:pds:context:investigation:mission.apollo_14',
    ntrs: { id: '19720037340', title: 'Apollo 14 mission report.' },
    sources: [nssdc('1971-008B', 'Apollo 14 Saturn IVB'), nasaImage('PIA12911'), pds('urn:nasa:pds:context:investigation:mission.apollo_14'), ntrs('19720037340', 'Apollo 14 mission report.')],
    whyLeftBehind: 'It was sent to the Moon on purpose: a spent rocket stage turned into a scientific instrument.',
    subsystems: [
      { name: 'S-IVB Third Stage', description: 'Upper stage of the Saturn V rocket', significance: 'Sent the crew towards the Moon, then became a seismic source.' }
    ],
    funFacts: [
      'Several Apollo missions crashed their spent third stages and lunar module ascent stages into the Moon for seismic studies.'
    ]
  }

];

export const CONSTELLATION_NODES: ConstellationNode[] = [
  // Machines (Mars on the left, the Moon on the right)
  { id: 'm-phoenix', artifactId: 'phoenix', label: 'Phoenix', category: 'machine', destination: 'MARS', description: 'Dug up water ice in the Martian arctic (2008)', bn: { description: 'মঙ্গলের মেরু অঞ্চলে মাটি খুঁড়ে পানির বরফ পেয়েছে (২০০৮)' }, x: 90, y: 55 },
  { id: 'm-viking1', artifactId: 'viking1', label: 'Viking 1', category: 'machine', destination: 'MARS', description: 'First clear photo from the surface of Mars and the first biology experiments on another world (1976)', bn: { description: 'মঙ্গলের মাটি থেকে প্রথম স্পষ্ট ছবি, আর অন্য জগতে প্রথম জীববিজ্ঞান পরীক্ষা (১৯৭৬)' }, x: 60, y: 150 },
  { id: 'm-sojourner', artifactId: 'sojourner', label: 'Sojourner', category: 'machine', destination: 'MARS', description: 'First wheeled rover to drive on Mars (1997)', bn: { description: 'মঙ্গলে চলা প্রথম চাকাওয়ালা রোভার (১৯৯৭)' }, x: 180, y: 140 },
  { id: 'm-viking2', artifactId: 'viking2', label: 'Viking 2', category: 'machine', destination: 'MARS', description: 'Photographed water frost at Utopia Planitia (1976–80)', bn: { description: 'ইউটোপিয়া প্ল্যানিশিয়ায় পানির বরফের ছবি তুলেছে (১৯৭৬–৮০)' }, x: 90, y: 260 },
  { id: 'm-spirit', artifactId: 'spirit', label: 'Spirit', category: 'machine', destination: 'MARS', description: 'Found silica about 90% pure in Gusev Crater (2004–10)', bn: { description: 'গুসেভ ক্রেটারে প্রায় ৯০% খাঁটি সিলিকা খুঁজে পেয়েছে (২০০৪–১০)' }, x: 260, y: 290 },
  { id: 'm-opportunity', artifactId: 'opportunity', label: 'Opportunity', category: 'machine', destination: 'MARS', description: 'Evidence of water at Meridiani, and 45.16 km driven (2004–18)', bn: { description: 'মেরিডিয়ানিতে পানির প্রমাণ, আর ৪৫.১৬ কিমি পথ (২০০৪–১৮)' }, x: 380, y: 150 },
  { id: 'm-ingenuity', artifactId: 'ingenuity', label: 'Ingenuity', category: 'machine', destination: 'MARS', description: 'First powered, controlled flight on another world (2021–24)', bn: { description: 'অন্য জগতে প্রথম চালিত, নিয়ন্ত্রিত উড্ডয়ন (২০২১–২৪)' }, x: 460, y: 60 },
  { id: 'm-perseverance', artifactId: 'perseverance', label: 'Perseverance', category: 'machine', destination: 'MARS', description: 'Seals rock samples from an ancient river delta (2021–)', bn: { description: 'প্রাচীন নদী-বদ্বীপ থেকে পাথরের নমুনা সিল করে রাখছে (২০২১–)' }, x: 560, y: 120 },
  { id: 'm-insight', artifactId: 'insight', label: 'InSight', category: 'machine', destination: 'MARS', description: 'Heard more than 1,300 marsquakes and impacts (2018–22)', bn: { description: '১,৩০০-র বেশি মঙ্গলকম্প আর উল্কাপাত শুনেছে (২০১৮–২২)' }, x: 490, y: 300 },
  { id: 'm-curiosity', artifactId: 'curiosity', label: 'Curiosity', category: 'machine', destination: 'MARS', description: 'Found that Gale Crater once held a lake microbes could have lived in (2012–)', bn: { description: 'দেখেছে গেল ক্রেটারে একসময় অণুজীবের বসবাসযোগ্য হ্রদ ছিল (২০১২–)' }, x: 370, y: 405 },
  { id: 'm-apollo11', artifactId: 'apollo11-descent', label: 'Apollo 11 Eagle', category: 'machine', destination: 'MOON', description: 'First crewed landing site on the Moon (1969)', bn: { description: 'চাঁদে মানুষের প্রথম অবতরণস্থল (১৯৬৯)' }, x: 680, y: 150 },
  { id: 'm-surveyor3', artifactId: 'surveyor3', label: 'Surveyor 3', category: 'machine', destination: 'MOON', description: 'Visited by the Apollo 12 crew, who brought parts of it back to Earth (1967, visited 1969)', bn: { description: 'অ্যাপোলো ১২-এর নভোচারীরা গিয়ে এর কিছু অংশ পৃথিবীতে ফিরিয়ে আনেন (১৯৬৭, পরিদর্শন ১৯৬৯)' }, x: 860, y: 45 },
  { id: 'm-alsep', artifactId: 'alsep-instruments', label: 'Apollo ALSEP', category: 'machine', destination: 'MOON', description: 'Nuclear-powered science stations that listened to the Moon (1969–77)', bn: { description: 'পারমাণবিক শক্তিতে চলা বিজ্ঞান স্টেশন, যারা চাঁদের কম্পন শুনেছে (১৯৬৯–৭৭)' }, x: 920, y: 165 },
  { id: 'm-apollo15', artifactId: 'apollo15-lrv', label: 'Apollo 15 LRV', category: 'machine', destination: 'MOON', description: 'First crewed rover on the Moon (1971)', bn: { description: 'চাঁদে মানুষের চালানো প্রথম রোভার (১৯৭১)' }, x: 790, y: 270 },
  { id: 'm-lrrr', artifactId: 'apollo11-lrrr', label: 'Apollo 11 LRRR', category: 'machine', destination: 'MOON', description: 'Laser mirror still used by observatories today (1969–)', bn: { description: 'আজও মানমন্দিরগুলো যে লেজার আয়না ব্যবহার করে (১৯৬৯–)' }, x: 1040, y: 300 },
  { id: 'm-apollo17', artifactId: 'apollo17-challenger', label: 'Apollo 17', category: 'machine', destination: 'MOON', description: 'Last crewed landing; orange soil of volcanic glass (1972)', bn: { description: 'মানুষের শেষ চন্দ্রাবতরণ; আগ্নেয় কাচের কমলা মাটি (১৯৭২)' }, x: 690, y: 405 },
  { id: 'm-apollo14sivb', artifactId: 'apollo14-sivb', label: 'Apollo 14 S-IVB', category: 'machine', destination: 'MOON', description: 'Rocket stage crashed on purpose as a seismic source (1971)', bn: { description: 'কম্পন তৈরির জন্য ইচ্ছা করে আছড়ে ফেলা রকেটের ধাপ (১৯৭১)' }, x: 1000, y: 410 },

  // What they taught us
  { id: 's-mobility', label: 'Moving on other worlds', category: 'science', description: 'Rocker-bogie wheels, hazard avoidance, crewed rovers and a helicopter', bn: { label: 'অন্য জগতে চলাচল', description: 'রকার-বোগি চাকা, বিপদ এড়িয়ে চলা, মানুষের চালানো রোভার আর একটি হেলিকপ্টার' }, x: 240, y: 55 },
  { id: 's-water', label: 'Water on Mars', category: 'breakthrough', description: 'Water-formed minerals, an ancient lake, frost and buried ice', bn: { label: 'মঙ্গলে পানি', description: 'পানিতে তৈরি খনিজ, প্রাচীন হ্রদ, তুষার আর মাটির নিচের বরফ' }, x: 300, y: 220 },
  { id: 's-hydrothermal', label: 'Ancient hot springs', category: 'science', description: 'Almost pure silica, a sign of ancient hot water', bn: { label: 'প্রাচীন উষ্ণ প্রস্রবণ', description: 'প্রায় খাঁটি সিলিকা, প্রাচীন গরম পানির চিহ্ন' }, x: 170, y: 390 },
  { id: 's-life', label: 'Searching for life', category: 'breakthrough', description: 'Biology experiments, a habitable lake and sealed samples', bn: { label: 'প্রাণের খোঁজ', description: 'জীববিজ্ঞান পরীক্ষা, বসবাসযোগ্য হ্রদ আর সিল করা নমুনা' }, x: 590, y: 225 },
  { id: 's-interior', label: 'Cores and quakes', category: 'breakthrough', description: 'Seismometers that measured crusts and a liquid metal core', bn: { label: 'কেন্দ্র আর কম্পন', description: 'যে সিসমোমিটার ভূত্বক আর তরল ধাতব কেন্দ্র মেপেছে' }, x: 570, y: 380 },
  { id: 's-archaeology', label: 'Revisiting old hardware', category: 'science', description: 'Going back to hardware left earlier, to see what happened to it', bn: { label: 'পুরোনো যন্ত্রের কাছে ফেরা', description: 'আগে রেখে আসা যন্ত্রের কাছে ফিরে গিয়ে দেখা তার কী হয়েছে' }, x: 690, y: 40 },
  { id: 's-lunar-geology', label: 'The Moon’s rocks', category: 'science', description: 'Rock and soil samples, including orange volcanic glass', bn: { label: 'চাঁদের পাথর', description: 'পাথর আর মাটির নমুনা, কমলা আগ্নেয় কাচসহ' }, x: 780, y: 120 },
  { id: 's-moonquakes', label: 'Moonquakes', category: 'breakthrough', description: 'After impacts the Moon rang like a bell for hours', bn: { label: 'চন্দ্রকম্প', description: 'আঘাতের পর চাঁদ ঘণ্টার মতো ঘণ্টার পর ঘণ্টা বেজেছে' }, x: 870, y: 340 },
  { id: 's-retroreflector', label: 'Laser ranging', category: 'science', description: 'Timing laser echoes to measure the Earth–Moon distance, still today', bn: { label: 'লেজারে দূরত্ব মাপা', description: 'লেজারের প্রতিধ্বনির সময় মেপে পৃথিবী–চাঁদের দূরত্ব নির্ণয়, আজও' }, x: 1020, y: 215 },
];

export const CONSTELLATION_LINKS: ConstellationLink[] = [
  { source: 'm-sojourner', target: 's-mobility', label: 'Rocker-bogie proof' },
  { source: 'm-opportunity', target: 's-water', label: 'Hematite and jarosite' },
  { source: 'm-opportunity', target: 's-mobility', label: '45.16 km driven' },
  { source: 'm-opportunity', target: 's-archaeology', label: 'Drove back to its heat shield' },
  { source: 'm-spirit', target: 's-hydrothermal', label: 'Broken-wheel silica find' },
  { source: 'm-spirit', target: 's-water', label: 'Hot-spring silica' },
  { source: 'm-phoenix', target: 's-water', label: 'Water ice' },
  { source: 'm-viking1', target: 's-life', label: 'Biology experiments' },
  { source: 'm-viking2', target: 's-water', label: 'Water frost' },
  { source: 'm-viking2', target: 's-life', label: 'Searched the soil for life' },
  { source: 'm-curiosity', target: 's-water', label: 'Ancient lake' },
  { source: 'm-curiosity', target: 's-life', label: 'Habitable lake' },
  { source: 'm-perseverance', target: 's-life', label: 'Sealed samples' },
  { source: 'm-ingenuity', target: 's-mobility', label: 'First flight on Mars' },
  { source: 'm-ingenuity', target: 's-archaeology', label: 'Photographed the backshell' },
  { source: 'm-insight', target: 's-interior', label: 'Marsquakes and the core' },
  { source: 'm-apollo11', target: 's-lunar-geology', label: 'First lunar samples' },
  { source: 'm-surveyor3', target: 's-archaeology', label: 'Visited by Apollo 12' },
  { source: 'm-apollo15', target: 's-mobility', label: 'First crewed rover on the Moon' },
  { source: 'm-apollo17', target: 's-lunar-geology', label: 'Orange volcanic glass' },
  { source: 'm-alsep', target: 's-moonquakes', label: 'Moon rang like a bell' },
  { source: 'm-alsep', target: 's-interior', label: 'Lunar seismic network' },
  { source: 'm-alsep', target: 's-retroreflector', label: 'Mirrors that need no power' },
  { source: 'm-lrrr', target: 's-retroreflector', label: 'Laser echoes' },
  { source: 'm-apollo14sivb', target: 's-moonquakes', label: 'Artificial moonquake' },
  { source: 'm-apollo14sivb', target: 's-interior', label: 'Probed the lunar interior' },
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
