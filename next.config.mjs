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
      },
      {
        source: "/articles/formaldehyde-and-odor-window-film",
        destination: "/articles/baike-011-window-film-odor-after-installation",
        permanent: true
      },
      {
        source: "/articles/furniture-fading-window-film",
        destination: "/articles/baike-012-furniture-fading-uv-protection",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
