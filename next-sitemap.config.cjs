/** @type {import('next-sitemap').IConfig} */

/** Russian recipe detail pages: /ru/album/{id} with any single-segment id (ObjectId, UUID, etc.) */
const RU_RECIPE_ALBUM_PATH = /^\/ru\/album\/[^/]+$/;

/**
 * @param {string} path
 * @returns {boolean}
 */
function isIndexableRecipePath(path) {
  return RU_RECIPE_ALBUM_PATH.test(path);
}

module.exports = {
  siteUrl: process.env.SITE_URL || "https://recipes-rho-ten.vercel.app",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.8,
  // Bracket patterns like "[locale]/auth" do not match real URLs — use transform whitelist instead.
  exclude: [
    "/*/auth",
    "/*/search",
    "/*/main/*",
    "/*/categories",
    "/*/categories/*",
    "/*/album",
    "/*/album/*/edit",
    "/en/album/*",
    "/en",
    "/ru"
  ],
  transform: async (config, path) => {
    if (!isIndexableRecipePath(path)) {
      return null;
    }

    return {
      loc: path,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString()
    };
  }
};
