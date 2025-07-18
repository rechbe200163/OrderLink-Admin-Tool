import { growthbookAdapter } from '@flags-sdk/growthbook';
import { flag } from 'flags/next';
import { identify } from './indentify';

export const myFeatureFlag = flag<boolean>({
  key: 'session-timer',
  adapter: growthbookAdapter.feature<boolean>(),
  defaultValue: false,
  identify,
});

export const favoritesFeatureFlag = flag<boolean>({
  key: 'nav-favorites',
  adapter: growthbookAdapter.feature<boolean>(),
  defaultValue: false,
  identify,
});
