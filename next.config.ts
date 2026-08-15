import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    // Both deploy configs (firebase.json frameworksBackend, apphosting.yaml)
    // run this as a real Node/Cloud Run server, so the built-in optimizer
    // (backed by `sharp`, now a dependency) works there the same as in dev.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skillicons.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
