import { config } from 'dotenv';

config();
console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_PORT', getEnvVariable('DB_PORT'));
console.log('DB_USER', getEnvVariable('DB_USER'));
console.log('DB_PASSWORD', getEnvVariable('DB_PASSWORD'));
console.log('DB_NAME', getEnvVariable('DB_NAME'));

export const environment = {
  database: {
    host: getEnvVariable('DB_HOST'),
    port: parseInt(getEnvVariable('DB_PORT'), 10),
    username: getEnvVariable('DB_USER'),
    password: getEnvVariable('DB_PASSWORD'),
    name: getEnvVariable('DB_NAME'),
  },
//   jwt: {
//     secret: getEnvVariable('JWT_SECRET'),
//     expiresIn: parseInt(getEnvVariable('JWT_EXPIRES_IN'), 10),
//     freshTokenExpiresIn: parseInt(getEnvVariable('JWT_REFRESH_EXPIRES_IN'), 10),
//   },
  app: {
    port: parseInt(getEnvVariable('APP_PORT'), 10),
    node_env: getEnvVariable('NODE_ENV'),
    // frontendDomain: getEnvVariable('FRONTEND_URL'),
    backendDomain: getBackendDomain(),
    //encryptionKey: getEnvVariable('ENCRYPTION_KEY'),
    // devEmails: getEnvVariable('DEV_EMAILS').split(','),
  },
//   mail: {
//     host: getEnvVariable('MAIL_HOST'),
//     port: parseInt(getEnvVariable('MAIL_PORT'), 10),
//     user: getEnvVariable('MAIL_USER'),
//     pass: getEnvVariable('MAIL_PASS'),
//     secure: getEnvVariable('MAIL_SECURE') === 'true', // Convert string to boolean
//     requireTLS: getEnvVariable('MAIL_REQUIRE_TLS') !== 'false', // Convert string to boolean
//     defaultEmail: getEnvVariable('MAIL_DEFAULT_EMAIL'),
//     appName: getEnvVariable('APP_NAME'),
//   },
//   storage: {
//     type: getEnvVariable('STORAGE_TYPE'),
//     s3: {
//       bucketName: getEnvVariable('S3_BUCKET_NAME'),
//       region: getEnvVariable('S3_REGION'),
//       accessKeyId: getEnvVariable('S3_ACCESS_KEY_ID'),
//       secretAccessKey: getEnvVariable('S3_SECRET_ACCESS_KEY'),
//     },
//     local: {
//       uploadDir: getEnvVariable('LOCAL_UPLOAD_DIR'),
//     },
//   },
};

function getBackendDomain(): string {
  const nodeEnv = getEnvVariable('NODE_ENV', false) || 'local';
  // Replace with actual environment variable name for each node environment
  switch (nodeEnv) {
    case 'development':
      return 'https://development.com/v1';
    case 'production':
      return 'https://production.com/v1';
    case 'local':
    default:
      return 'http://127.0.0.1:3000/v1';
  }
}

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];

  if (required && (value === undefined || value.trim() === '')) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value!;
}