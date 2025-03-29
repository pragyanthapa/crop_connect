import fs from 'fs';
import path  from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
} else {
  console.log('Uploads directory already exists');
} 