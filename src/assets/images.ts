// Real NASA photographs (public domain) from the NASA Image and Video Library,
// resized to max 1280 px and saved as WebP so they work offline.
import sojournerPhoto from './images/nasa/sojourner.webp';
import opportunityPhoto from './images/nasa/opportunity.webp';
import spiritPhoto from './images/nasa/spirit.webp';
import phoenixPhoto from './images/nasa/phoenix.webp';
import insightPhoto from './images/nasa/insight.webp';
import viking1Photo from './images/nasa/viking1.webp';
import apollo11DescentPhoto from './images/nasa/apollo11-descent.webp';
import apollo11LrrrPhoto from './images/nasa/apollo11-lrrr.webp';
import apollo15LrvPhoto from './images/nasa/apollo15-lrv.webp';
import alsepPhoto from './images/nasa/alsep-instruments.webp';
import surveyor3Photo from './images/nasa/surveyor3.webp';
import curiosityPhoto from './images/nasa/curiosity.webp';
import perseverancePhoto from './images/nasa/perseverance.webp';
import marsPolarLanderPhoto from './images/nasa/mars-polar-lander.webp';
import heroApollo11Shadow from './images/nasa/hero-apollo11-shadow.webp';
import insightFirstSelfie from './images/nasa/insight-first.webp';
import lrocApollo11 from './images/nasa/lroc-apollo11.webp';
import lrocApollo12 from './images/nasa/lroc-apollo12.webp';
import viking2Photo from './images/nasa/viking2.webp';
import opportunityHeatShieldPhoto from './images/nasa/opportunity-heatshield.webp';
import perseveranceBackshellPhoto from './images/nasa/perseverance-backshell.webp';
import ingenuityPhoto from './images/nasa/ingenuity.webp';
import apollo17Photo from './images/nasa/apollo17.webp';
import lrocApollo17 from './images/nasa/lroc-apollo17.webp';
import apollo14SivbPhoto from './images/nasa/apollo14-sivb.webp';

/** Scene images (also real NASA photographs, public domain). */
export const ASSET_IMAGES = {
  /** AS11-37-5505: the Apollo 11 lunar module's shadow over astronaut footprints. */
  hero: heroApollo11Shadow,
  /** PIA22876: InSight's first selfie, December 2018 (sol 10). */
  insightFirst: insightFirstSelfie,
  /** PIA25287: InSight's final selfie, April 2022 (sol 1211). */
  insightFinal: insightPhoto,
};

export const NASA_PHOTOS = {
  sojourner: sojournerPhoto,
  opportunity: opportunityPhoto,
  spirit: spiritPhoto,
  phoenix: phoenixPhoto,
  insight: insightPhoto,
  viking1: viking1Photo,
  apollo11Descent: apollo11DescentPhoto,
  apollo11Lrrr: apollo11LrrrPhoto,
  apollo15Lrv: apollo15LrvPhoto,
  alsep: alsepPhoto,
  surveyor3: surveyor3Photo,
  curiosity: curiosityPhoto,
  perseverance: perseverancePhoto,
  marsPolarLander: marsPolarLanderPhoto,
  lrocApollo11,
  lrocApollo12,
  viking2: viking2Photo,
  opportunityHeatShield: opportunityHeatShieldPhoto,
  perseveranceBackshell: perseveranceBackshellPhoto,
  ingenuity: ingenuityPhoto,
  apollo17: apollo17Photo,
  lrocApollo17,
  apollo14Sivb: apollo14SivbPhoto,
};
