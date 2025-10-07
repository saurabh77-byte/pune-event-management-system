import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        {
            eventId: 1,
            userId: 'profile_01h4kxt2e8z9y3b1n7m6q5w8r4',
            rating: 5,
            comment: 'Amazing venue! The arrangements were perfect and staff was very helpful. The sound system was top-notch and the seating arrangements were comfortable. Would definitely recommend this venue for corporate events.',
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            eventId: 2,
            userId: 'profile_02h5lyu3f9a1z4c2o8n7r6x9s5',
            rating: 4,
            comment: 'Good experience overall but the parking was an issue. The event itself was well organized and the venue was beautiful. Food quality was excellent.',
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            eventId: 3,
            userId: 'profile_03h6mzv4g0b2a5d3p9o8s7y0t6',
            rating: 5,
            comment: 'Excellent event management. Everything was on time.',
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            eventId: 4,
            userId: 'profile_04h7n0w5h1c3b6e4q0p9t8z1u7',
            rating: 5,
            comment: 'The sound system was great. Enjoyed the concert thoroughly! The acoustics in the hall were amazing and the lighting setup created a wonderful atmosphere. Best concert experience in Pune.',
            createdAt: new Date('2024-12-01').toISOString(),
        },
        {
            eventId: 5,
            userId: 'profile_05h8o1x6i2d4c7f5r1q0u9a2v8',
            rating: 3,
            comment: 'Average experience. Expected better food arrangements.',
            createdAt: new Date('2024-12-05').toISOString(),
        },
        {
            eventId: 6,
            userId: 'profile_01h4kxt2e8z9y3b1n7m6q5w8r4',
            rating: 5,
            comment: 'Perfect wedding venue! Our guests loved it. The decoration team did an outstanding job and the catering service was exceptional. The venue manager was very cooperative and handled everything professionally.',
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            eventId: 7,
            userId: 'profile_02h5lyu3f9a1z4c2o8n7r6x9s5',
            rating: 4,
            comment: 'The workshop was very informative and well organized. The trainer was knowledgeable and engaging. Good networking opportunities with other participants.',
            createdAt: new Date('2024-12-10').toISOString(),
        },
        {
            eventId: 8,
            userId: 'profile_03h6mzv4g0b2a5d3p9o8s7y0t6',
            rating: 2,
            comment: 'Not satisfied with the service. Too crowded.',
            createdAt: new Date('2024-12-12').toISOString(),
        },
        {
            eventId: 9,
            userId: 'profile_04h7n0w5h1c3b6e4q0p9t8z1u7',
            rating: 5,
            comment: 'Wonderful cultural program! The performances were mesmerizing and the event coordination was flawless. The venue ambiance added to the overall experience. Highly recommended for cultural events.',
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            eventId: 10,
            userId: 'profile_05h8o1x6i2d4c7f5r1q0u9a2v8',
            rating: 4,
            comment: 'Great sports facility with modern equipment. The tournament was well managed with proper scheduling. Only issue was the limited refreshment options available.',
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            eventId: 11,
            userId: 'profile_01h4kxt2e8z9y3b1n7m6q5w8r4',
            rating: 5,
            comment: 'Best tech conference I have attended!',
            createdAt: new Date('2024-12-20').toISOString(),
        },
        {
            eventId: 12,
            userId: 'profile_02h5lyu3f9a1z4c2o8n7r6x9s5',
            rating: 4,
            comment: 'Lovely art exhibition with diverse collection. The gallery space was well lit and the artwork was beautifully displayed. Would like to see more contemporary Indian art in future exhibitions.',
            createdAt: new Date('2024-12-22').toISOString(),
        },
        {
            eventId: 1,
            userId: 'profile_03h6mzv4g0b2a5d3p9o8s7y0t6',
            rating: 3,
            comment: 'Decent venue but AC was not working properly. Staff tried their best to accommodate but it was uncomfortable during peak hours.',
            createdAt: new Date('2024-12-25').toISOString(),
        },
        {
            eventId: 2,
            userId: 'profile_04h7n0w5h1c3b6e4q0p9t8z1u7',
            rating: 5,
            comment: 'Outstanding arrangements for the fashion show! The runway setup was professional and the lighting was perfect for photography. Very impressed with the backstage management.',
            createdAt: new Date('2024-12-28').toISOString(),
        },
        {
            eventId: 3,
            userId: 'profile_05h8o1x6i2d4c7f5r1q0u9a2v8',
            rating: 4,
            comment: 'Good business networking event. Met many interesting people.',
            createdAt: new Date('2024-12-30').toISOString(),
        },
        {
            eventId: 4,
            userId: 'profile_01h4kxt2e8z9y3b1n7m6q5w8r4',
            rating: 3,
            comment: 'The event was okay but seating arrangement could be better. Some seats had restricted view of the stage.',
            createdAt: new Date('2025-01-02').toISOString(),
        },
        {
            eventId: 5,
            userId: 'profile_02h5lyu3f9a1z4c2o8n7r6x9s5',
            rating: 5,
            comment: 'Fantastic food festival! Amazing variety of cuisines and all stalls were well maintained. The organizers did a great job in bringing together top restaurants from Pune.',
            createdAt: new Date('2025-01-05').toISOString(),
        },
        {
            eventId: 6,
            userId: 'profile_03h6mzv4g0b2a5d3p9o8s7y0t6',
            rating: 2,
            comment: 'Expected much better. Long waiting time and poor crowd management.',
            createdAt: new Date('2025-01-08').toISOString(),
        },
        {
            eventId: 7,
            userId: 'profile_04h7n0w5h1c3b6e4q0p9t8z1u7',
            rating: 4,
            comment: 'Very informative seminar with excellent speakers.',
            createdAt: new Date('2025-01-10').toISOString(),
        },
        {
            eventId: 8,
            userId: 'profile_05h8o1x6i2d4c7f5r1q0u9a2v8',
            rating: 3,
            comment: null,
            createdAt: new Date('2025-01-12').toISOString(),
        },
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});