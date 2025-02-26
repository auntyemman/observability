import { DataSourceOptions, DataSource } from 'typeorm';
import { environment } from '../utils/environment.util';

// Create DataSource instance for app services
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: environment.database.host,
  port: environment.database.port,
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.name,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: environment.app.node_env === 'development', // true in development, false in production
  // logging: environment.app.node_env !== 'production', // false in production, true in development
  migrationsRun: true, // Uncomment to automatically run migrations on app start
};

// Create DataSource instance for CLI services
const CliDataSource = new DataSource(dataSourceOptions);

export default CliDataSource;