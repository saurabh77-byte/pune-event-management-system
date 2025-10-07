import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Wedding',
            description: 'Traditional and modern wedding ceremonies',
            icon: '💒',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Corporate Event',
            description: 'Business conferences, team building, and corporate gatherings',
            icon: '🏢',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Concert',
            description: 'Live music performances and concerts',
            icon: '🎵',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Birthday Party',
            description: 'Birthday celebrations for all ages',
            icon: '🎂',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Conference',
            description: 'Professional conferences and seminars',
            icon: '🎤',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Cultural Festival',
            description: 'Cultural events and festivals celebrating traditions',
            icon: '🎭',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Workshop',
            description: 'Educational workshops and training sessions',
            icon: '📚',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Sports Event',
            description: 'Sports tournaments and athletic competitions',
            icon: '⚽',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});