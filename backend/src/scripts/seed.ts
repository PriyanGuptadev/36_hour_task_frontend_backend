import { database } from "../config/database";
import { AnomalyAlertService } from "../services/anomalyAlertService";
import { logger } from "../config/logger";

const seedData = [
  {
    alertType: 'mild' as const,
    audioFilePath: '/uploads/sample_mild_1.wav',
    suspectedReason: 'Minor vibration detected in bearing assembly',
    action: 'Monitor for 24 hours',
    comment: 'Low amplitude signals, likely normal wear'
  },
  {
    alertType: 'moderate' as const,
    audioFilePath: '/uploads/sample_moderate_1.wav',
    suspectedReason: 'Unusual frequency patterns in motor',
    action: 'Schedule maintenance within 48 hours',
    comment: 'Medium amplitude signals, requires attention'
  },
  {
    alertType: 'severe' as const,
    audioFilePath: '/uploads/sample_severe_1.wav',
    suspectedReason: 'Critical equipment malfunction detected',
    action: 'Immediate shutdown and inspection required',
    comment: 'High amplitude signals, potential safety risk'
  },
  {
    alertType: 'mild' as const,
    audioFilePath: '/uploads/sample_mild_2.wav',
    suspectedReason: 'Slight increase in background noise',
    action: 'Continue monitoring',
    comment: 'Within acceptable parameters'
  },
  {
    alertType: 'severe' as const,
    audioFilePath: '/uploads/sample_severe_2.wav',
    suspectedReason: 'Bearing failure imminent',
    action: 'Emergency maintenance team dispatched',
    comment: 'Critical frequency spikes detected'
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await database.connect();
    logger.info('Connected to database for seeding');

    const alertService = new AnomalyAlertService();

    // Clear existing data
    const db = database.getDb();
    await db.collection('anomaly_alerts').deleteMany({});
    logger.info('Cleared existing anomaly alerts');

    // Insert seed data
    for (const data of seedData) {
      const alert = await alertService.createAlert(data);
      logger.info(`Created alert with ID: ${alert._id}`);
    }

    logger.info(`Successfully seeded ${seedData.length} anomaly alerts`);
    
    // Disconnect from database
    await database.disconnect();
    logger.info('Disconnected from database');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 