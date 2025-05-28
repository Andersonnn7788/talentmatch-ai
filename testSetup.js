// Quick test to check database setup status
import { checkDatabaseSetup, printSetupReport } from './src/utils/databaseSetupCheck.js';

async function runTest() {
  console.log('🔍 Checking database setup for resume upload...\n');
  
  try {
    const results = await checkDatabaseSetup();
    printSetupReport(results);
    
    // Generate a quick summary
    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;
    
    console.log(`\n📊 Summary: ${successCount}/${totalCount} checks passed`);
    
    if (successCount === totalCount) {
      console.log('✅ All systems ready for resume upload testing!');
    } else {
      console.log('⚠️  Some setup steps are required before testing resume uploads.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();
