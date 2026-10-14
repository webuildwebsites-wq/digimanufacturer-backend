import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URL);
  
  for (const dbName of ['newdigioptics-manufacture', 'digioptics-manufacture', 'digioptics-wholeseller']) {
    console.log(`\n=================== Database: ${dbName} ===================`);
    const db = mongoose.connection.client.db(dbName);
    const emps = await db.collection('employees').find({}).toArray();
    console.log(`Total employees: ${emps.length}`);
    for (const e of emps) {
      console.log(`- Username: "${e.username}", Email: "${e.email}", Code: "${e.employeeCode}", Name: "${e.employeeName}", Type: "${e.EmployeeType}", Active: ${e.isActive}, LastLogin: ${e.lastLogin}`);
    }
  }
  await mongoose.disconnect();
}
check().catch(console.error);
