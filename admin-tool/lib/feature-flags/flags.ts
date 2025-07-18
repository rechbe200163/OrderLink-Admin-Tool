import { growthbookAdapter } from '@flags-sdk/growthbook';
import { flag } from 'flags/next';
import { identify } from './indentify';

export const myFeatureFlag = flag<boolean>({
  key: 'session-timer',
  adapter: growthbookAdapter.feature<boolean>(),
  defaultValue: false,
  identify,
});
