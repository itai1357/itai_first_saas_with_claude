const { initConfigManager, getConfigManager } = require("@myorg/config-manager");

/** @type {() => Promise<import('next').NextConfig>} */
module.exports = async () => {
  initConfigManager();
  const backendUrl = getConfigManager().get("BACKEND_URL") || "http://localhost:3001";

  return {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ];
    },
  };
};
