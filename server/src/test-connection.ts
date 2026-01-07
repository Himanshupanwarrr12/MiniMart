import {prisma} from "./lib/prisma.js"

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query works!', result);
    
    console.log('\n🎉 Everything is working!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('\nPossible issues:');
    console.error('1. Check your DATABASE_URL in .env file');
    console.error('2. Make sure PostgreSQL is running');
    console.error('3. Check database credentials (username/password)');
    console.error('4. Check if database exists');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();