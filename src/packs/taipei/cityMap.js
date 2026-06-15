/**
 * @file cityMap.js — Taipei pack cityMap (P6a partial).
 *
 * Re-exports the Tokyo cityMap namespace as placeholders for everything the
 * engine reads, EXCEPT:
 *   - SKYTREE_POS  → overridden to TAIPEI101_POS (same coords in P6a;
 *                    P6b will move it to the real Xinyi 信義 anchor)
 *   - DEV_STARTS   → overridden with Taipei-themed teleport keys
 *                    (shop / night-market / arcade / scooter-sea /
 *                     wanhua / xinyi / goal) per R9
 *
 * All other exports (SHOP, PLACEMENTS, ZONES, LANDMARKS, COLLECTIBLES,
 * bandAllowedAt, MAP_BOUNDS, …) stay Tokyo until P6b replaces them.
 */

// Import the Taipei 101 goal position so SKYTREE_POS resolves to it.
import { TAIPEI101_POS } from './monument.js';

// Re-export everything from the Tokyo city map that we do NOT override.
export {
  SHOP,
  MAP_BOUNDS,
  ZONES,
  bandAllowedAt,
  LANDMARKS,
  COLLECTIBLES,
  COLLECTIBLE_IDS,
  PLACEMENTS,
  validateCityMap,
  EXTRA_CODE_BASE,
  CODE_SHOP_SHELL,
} from '../../config/cityMap.js';

/**
 * Goal monument real-meter position (terrain base collider + goalTower pose +
 * environment silhouette azimuth all read this). P6a: same map coords as the
 * Tokyo Skytree anchor; P6b moves to real Xinyi coordinates.
 *
 * The name SKYTREE_POS is preserved verbatim so existing engine imports
 * (terrain.js, goalTower.js) that do
 *   const SKYTREE_POS = activePack.cityMap.SKYTREE_POS;
 * resolve without any change.
 */
export const SKYTREE_POS = TAIPEI101_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Taipei ladder keys (R9): shop / night-market / arcade /
 * scooter-sea / wanhua / xinyi / goal.
 *
 * Positions are sensible approximations relative to ball-start origin;
 * P6b will anchor them to the real Taipei city map.
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 迪化街 shop — identical to Tokyo 'shop'. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 饒河街夜市 night-market strip (east quadrant). */
  'night-market': Object.freeze({ x: 60,   z: -80,   r: 0.5  }),
  /** 西門町 arcade / 娛樂街 district. */
  arcade:      Object.freeze({ x: -180, z: 120,   r: 3    }),
  /** 機車海 scooter-sea band (mid-map density ramp). */
  'scooter-sea': Object.freeze({ x: 100,  z: 300,   r: 30   }),
  /** 萬華 / 龍山寺 district (mid-radius). */
  wanhua:      Object.freeze({ x: -350, z: 600,   r: 120  }),
  /** 信義計畫區 Xinyi CBD (approach zone near 101). */
  xinyi:       Object.freeze({ x: 500,  z: -350,  r: 300  }),
  /** Near the 台北101 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -400,  r: 400  }),
});
