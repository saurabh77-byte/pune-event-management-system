import { db } from '@/db';
import { profiles } from '@/db/schema';

async function main() {
    const sampleProfiles = [
        {
            id: 'profile_01h4kxt2e8z9y3b1n7m6q5w8r4',
            email: 'rahul.sharma@example.com',
            fullName: 'Rahul Sharma',
            phone: '+91-9876543210',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_02h5lyu3f9a1z4c2o8n7r6x9s5',
            email: 'priya.patel@example.com',
            fullName: 'Priya Patel',
            phone: '+91-9876543211',
            role: 'user',
            avatarUrl: null,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_03h6mzv4g0b2a5d3p9o8s7y0t6',
            email: 'amit.kumar@example.com',
            fullName: 'Amit Kumar',
            phone: '+91-9876543212',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_04h7n0w5h1c3b6e4q0p9t8z1u7',
            email: 'sneha.desai@example.com',
            fullName: 'Sneha Desai',
            phone: '+91-9876543213',
            role: 'user',
            avatarUrl: null,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_05h8o1x6i2d4c7f5r1q0u9a2v8',
            email: 'rohan.mehta@example.com',
            fullName: 'Rohan Mehta',
            phone: '+91-9876543214',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_06h9p2y7j3e5d8g6s2r1v0b3w9',
            email: 'vikram.singh@example.com',
            fullName: 'Vikram Singh',
            phone: '+91-9876543215',
            role: 'event_manager',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_07h0q3z8k4f6e9h7t3s2w1c4x0',
            email: 'anjali.joshi@example.com',
            fullName: 'Anjali Joshi',
            phone: '+91-9876543216',
            role: 'event_manager',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_08h1r4a9l5g7f0i8u4t3x2d5y1',
            email: 'karan.verma@example.com',
            fullName: 'Karan Verma',
            phone: '+91-9876543217',
            role: 'event_manager',
            avatarUrl: null,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_09h2s5b0m6h8g1j9v5u4y3e6z2',
            email: 'neha.kulkarni@example.com',
            fullName: 'Neha Kulkarni',
            phone: '+91-9876543218',
            role: 'event_manager',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
            createdAt: new Date().toISOString(),
        },
        {
            id: 'profile_10h3t6c1n7i9h2k0w6v5z4f7a3',
            email: 'arjun.reddy@example.com',
            fullName: 'Arjun Reddy',
            phone: '+91-9876543219',
            role: 'event_manager',
            avatarUrl: null,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(profiles).values(sampleProfiles);
    
    console.log('✅ Profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});