/**
 * Feature flags — MVP scope control (2026-10-13).
 *
 * The MVP ships: weekly planner + auto grocery list + recipe discovery
 * (Ramadan mode stays). Features set to `false` are hidden from the UI,
 * but their code and routes stay intact — flip a flag back to `true` to
 * re-enable a feature without touching any component.
 */
export const FEATURE_FLAGS = {
  /** Top-10 leaderboard tab + nav entries */
  leaderboard: false,
  /** Visitor counter on the landing page */
  visitorCounter: false,
  /** Monthly calendar planner view (weekly planner always stays) */
  monthlyPlanner: false,
  /** Google Apps Script sync section inside the family-sync modal */
  appsScriptSync: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag];
