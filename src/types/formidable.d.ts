module.exports = {
    experimental: {
      reactRoot: true, // ทำให้ React ทำงานได้ดีขึ้นใน Next.js
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = ['formidable']; // ไม่ให้ใช้ formidable ในฝั่ง server
      }
      return config;
    },
  };
  