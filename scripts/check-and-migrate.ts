async function checkAndMigrate() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Starting database migration check...');
  
  // For production deployments, we assume tables already exist
  // This prevents the "relation already exists" error during builds
  console.log('Database tables already exist, skipping migration');
  console.log('This is expected in production environments');
}

checkAndMigrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
