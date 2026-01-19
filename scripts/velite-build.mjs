import { build } from 'velite';

console.log('🔄 Building Velite...');

try {
  await build({ watch: false, clean: true });
  console.log('✅ Velite build complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Velite build failed:', error.message);
  process.exit(1);
}
