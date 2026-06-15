/**
 * @file active.js — THE single active StagePack the engine reads.
 * Phase 1 (P2): tokyo transient (proves byte-identity). P3 flips this to
 * taipei. Engine modules import the active pack from here, never from a
 * specific pack module.
 */
export { activePack, default } from './_tokyo_transient/index.js';
