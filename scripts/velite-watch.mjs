import { build } from 'velite';

console.log('🔄 Starting Velite in watch mode...');

try {
    await build({ watch: true, clean: false });
} catch (error) {
    console.error('❌ Velite watch failed:', error.message);
    process.exit(1);
}
