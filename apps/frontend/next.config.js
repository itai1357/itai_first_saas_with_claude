const { ConfigManager, EnvConfigProvider } = require("@myorg/config-manager");

/** @type {() => Promise<import('next').NextConfig>} */
module.exports = async () => {
  const config = new ConfigManager(new EnvConfigProvider());
  const backendUrl = (await config.get("BACKEND_URL")) || "http://localhost:3001";

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
