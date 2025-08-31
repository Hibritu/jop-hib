const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seeder...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        role: 'admin',
        email: 'admin@hirehub.com' 
      } 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Create admin user with demo credentials
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      id: uuidv4(),
      role: 'admin',
      email: 'admin@hirehub.com',
      phone: '+251911234567',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      gender: 'male',
      is_verified: true,
      two_factor_secret: '123456',
      preferred_categories: [],
      preferred_locations: [],
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@hirehub.com');
    console.log('🔒 Password: admin123');
    console.log('🔑 2FA Code: 123456');
    console.log('🆔 Admin ID:', adminUser.id);
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('ℹ️  Admin user might already exist with different details');
      return await User.findOne({ where: { email: 'admin@hirehub.com' } });
    }
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  const { sequelize } = require('../config/db');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected');
      return seedAdmin();
    })
    .then(() => {
      console.log('🎉 Admin seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAdmin };
