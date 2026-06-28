import testedChannels from './testedChannels.json';

/**
 * Fetch and return the precompiled channel database parsed from
 * the SArun61/IPTV git repository and verified working CDN stream endpoints.
 * Old remote APIs have been completely removed.
 */
export async function fetchAllChannels() {
  return testedChannels;
}
