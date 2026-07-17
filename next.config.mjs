/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/articles/does-heat-film-affect-light",
        destination: "/articles/baike-004-window-film-daylighting",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
