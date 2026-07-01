import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = 'NandriFoundation2';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGithubActions ? { output: 'export' as const } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(isGithubActions
    ? {
        basePath: `/${repositoryName}`,
        assetPrefix: `/${repositoryName}/`,
      }
    : {}),
};

export default nextConfig;
