import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shapes');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      email: 'admin@shapes.local',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
