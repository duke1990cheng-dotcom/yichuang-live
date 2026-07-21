/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/articles/does-heat-film-affect-light",
        destination: "/articles/baike-004-window-film-daylighting",
        permanent: true
      },
      {
        source: "/articles/home-window-film-vs-car-film",
        destination: "/articles/baike-008-home-window-film-vs-car-film",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
