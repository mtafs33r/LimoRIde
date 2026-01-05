// Simple script to create default admin user
// Run with: node create-admin.js (make sure MongoDB is running)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use your MongoDB connection string
const MONGODB_URI = process.env.MONGO_DB_URI || 'your-mongodb-connection-string';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  nationality: String,
  nationalId: String,
  gender: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'register' });

const Register = mongoose.models.Register || mongoose.model('Register', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Register.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Register.create({
      name: 'Admin',
      email: 'admin@limoride.com',
      password: hashedPassword,
      contact: '1234567890',
      nationality: 'Canadian',
      nationalId: 'ADMIN001',
      gender: 'male',
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@limoride.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please change the password after first login!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();











