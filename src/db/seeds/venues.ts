import { db } from '@/db';
import { venues } from '@/db/schema';

async function main() {
    const sampleVenues = [
        {
            name: 'Royal Gardens Convention Center',
            address: '123 Kothrud Road, Near MIT College',
            city: 'Pune',
            area: 'Kothrud',
            capacity: 500,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'Projector', 'WiFi', 'Stage']),
            pricePerHour: 25000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329'
            ]),
            managerId: 'profile_06h9p2y7j3e5d8g6s2r1v0b3w9',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'TechHub Event Space',
            address: '456 Rajiv Gandhi Infotech Park, Phase 2',
            city: 'Pune',
            area: 'Hinjewadi',
            capacity: 300,
            amenities: JSON.stringify(['AC', 'Parking', 'WiFi', 'Projector', 'Conference Rooms', 'Video Conferencing']),
            pricePerHour: 15000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
                'https://images.unsplash.com/photo-1511578314322-379afb476865'
            ]),
            managerId: 'profile_07h0q3z8k4f6e9h7t3s2w1c4x0',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Viman Nagar Banquet Hall',
            address: '789 Airport Road, Opposite Phoenix Mall',
            city: 'Pune',
            area: 'Viman Nagar',
            capacity: 800,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'Stage', 'Dance Floor', 'Bar', 'WiFi']),
            pricePerHour: 35000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3',
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3'
            ]),
            managerId: 'profile_08h1r4a9l5g7f0i8u4t3x2d5y1',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Kalyani Grand',
            address: '234 Kalyani Nagar Main Road, Near German Bakery',
            city: 'Pune',
            area: 'Kalyani Nagar',
            capacity: 600,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'Projector', 'WiFi', 'Stage', 'Green Room']),
            pricePerHour: 30000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329',
                'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3'
            ]),
            managerId: 'profile_09h2s5b0m6h8g1j9v5u4y3e6z2',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Aundh Heritage Lawns',
            address: '567 Aundh-Baner Link Road, Near IT Park',
            city: 'Pune',
            area: 'Aundh',
            capacity: 1000,
            amenities: JSON.stringify(['Open Lawn', 'Parking', 'Catering', 'Audio System', 'Stage', 'WiFi', 'Decorations', 'AC Tents']),
            pricePerHour: 45000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329',
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330'
            ]),
            managerId: 'profile_10h3t6c1n7i9h2k0w6v5z4f7a3',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Wakad Palace',
            address: '890 Wakad Road, Near Datta Mandir',
            city: 'Pune',
            area: 'Wakad',
            capacity: 400,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'WiFi', 'Stage', 'Dance Floor']),
            pricePerHour: 20000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1511578314322-379afb476865',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
            ]),
            managerId: 'profile_06h9p2y7j3e5d8g6s2r1v0b3w9',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Baner Heights Convention',
            address: '345 Baner Pashan Link Road, Near Orchid School',
            city: 'Pune',
            area: 'Baner',
            capacity: 700,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'Projector', 'WiFi', 'Stage', 'Video Wall', 'Green Room']),
            pricePerHour: 40000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329'
            ]),
            managerId: 'profile_07h0q3z8k4f6e9h7t3s2w1c4x0',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Shivajinagar Cultural Center',
            address: '678 JM Road, Near Fergusson College',
            city: 'Pune',
            area: 'Shivajinagar',
            capacity: 250,
            amenities: JSON.stringify(['AC', 'Parking', 'Audio System', 'Projector', 'WiFi', 'Stage', 'Library']),
            pricePerHour: 12000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
                'https://images.unsplash.com/photo-1511578314322-379afb476865'
            ]),
            managerId: 'profile_08h1r4a9l5g7f0i8u4t3x2d5y1',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Koregaon Park Club',
            address: '901 North Main Road, Near Osho Ashram',
            city: 'Pune',
            area: 'Koregaon Park',
            capacity: 350,
            amenities: JSON.stringify(['AC', 'Parking', 'Catering', 'Audio System', 'WiFi', 'Stage', 'Bar', 'Swimming Pool', 'Garden']),
            pricePerHour: 28000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1478146896981-b80fe463b330',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329'
            ]),
            managerId: 'profile_09h2s5b0m6h8g1j9v5u4y3e6z2',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Hadapsar Sports Complex',
            address: '432 Hadapsar-Manjri Road, Near Magarpatta City',
            city: 'Pune',
            area: 'Hadapsar',
            capacity: 900,
            amenities: JSON.stringify(['Open Ground', 'Parking', 'Catering', 'Audio System', 'Stage', 'WiFi', 'Sports Facilities', 'Changing Rooms']),
            pricePerHour: 50000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
                'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3',
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
            ]),
            managerId: 'profile_10h3t6c1n7i9h2k0w6v5z4f7a3',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(venues).values(sampleVenues);
    
    console.log('✅ Venues seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});