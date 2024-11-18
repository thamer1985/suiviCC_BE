module.exports = {
  apps: [
    {
      name: 'suiviCC_Backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        JWT_SECRET: 'cc07102024',
	DATABASE_URL_GENERAL: 'mysql://suivi_cc:suivi_cc@localhost:3306/general',
        DATABASE_URL: 'mysql://suivi_cc:suivi_cc@localhost:3306/suivi_cc_dev',
        SHADOW_DATABASE_URL: 'mysql://suivi_cc:suivi_cc@localhost:3306/suivi_cc_shadow',
      },
    },
  ],
};