import { MachineStatus } from '../types/mission';

/** One colour per status, used for status dots everywhere so the colour carries meaning.
 *  The status word is always shown next to the dot, so colour is never the only signal. */
export const STATUS_COLORS: Record<MachineStatus, string> = {
  ACTIVE: '#62D9FF',
  SILENT: '#F3B562',
  INACTIVE: '#D9DDE3',
  LOST: '#FF6B6B',
  HISTORIC: '#D0704A',
};
