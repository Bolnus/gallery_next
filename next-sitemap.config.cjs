/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://recipes-rho-ten.vercel.app",
  generateRobotsTxt: true,
  exclude: ["[locale]/album/[id]/edit", "[locale]/album"]
};
