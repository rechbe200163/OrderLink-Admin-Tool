import postHogClient from './posthog-clients';

export const favoritesFeatureFlag =
  (await postHogClient.isFeatureEnabled('favorites', 'admin-tool')) ?? false;

export const sessionTimerFeatureFlag =
  (await postHogClient.isFeatureEnabled('session-timer', 'admin-tool')) ??
  false;
