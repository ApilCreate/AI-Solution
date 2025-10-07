import { db } from '../db';
import { ratings } from '../db/schema';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

function generateSampleRatings() {
  const sampleRatings = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      rating: 5,
      comment: "Exceptional AI solutions! The team delivered exactly what we needed for our data analytics project. The implementation was smooth and the results exceeded our expectations.",
      isPublished: true,
      status: "published"
    },
    {
      name: "Michael Chen",
      email: "m.chen@innovateai.com",
      rating: 4,
      comment: "Great service and support. The AI platform helped us automate our customer service processes significantly. Minor learning curve but worth it.",
      isPublished: true,
      status: "published"
    },
    {
      name: "Emily Rodriguez",
      email: "emily.r@datasolutions.com",
      rating: 5,
      comment: "Outstanding work! The machine learning models they developed for our recommendation system are incredibly accurate. Highly recommend their services.",
      isPublished: true,
      status: "published"
    },
    {
      name: "David Thompson",
      email: "david.t@fintech.com",
      rating: 4,
      comment: "Professional team with deep AI expertise. They helped us implement fraud detection algorithms that reduced false positives by 40%. Very satisfied with the results.",
      isPublished: true,
      status: "published"
    },
    {
      name: "Lisa Wang",
      email: "lisa.wang@healthtech.com",
      rating: 5,
      comment: "Revolutionary AI implementation for our medical imaging analysis. The accuracy and speed improvements have been remarkable. Excellent communication throughout the project.",
      isPublished: true,
      status: "published"
    },
    {
      name: "James Wilson",
      email: "james.w@retailtech.com",
      rating: 4,
      comment: "Solid AI solutions for our inventory management. The predictive analytics have helped us reduce stockouts by 30%. Good value for the investment.",
      isPublished: true,
      status: "published"
    },
    {
      name: "Maria Garcia",
      email: "maria.g@edutech.com",
      rating: 5,
      comment: "Fantastic AI-powered learning platform! The personalized learning recommendations have improved student engagement by 60%. The team was responsive and professional.",
      isPublished: true,
      status: "published"
    },
    {
      name: "Robert Kim",
      email: "robert.k@logistics.com",
      rating: 4,
      comment: "Excellent route optimization AI solution. Reduced our delivery times by 25% and fuel costs by 15%. The implementation was well-managed and on schedule.",
      isPublished: true,
      status: "published"
    }
  ];

  return sampleRatings;
}

async function addSampleRatings() {
  try {
    console.log('Adding 8 diverse sample ratings...');
    console.log('=====================================');
    
    // Check current state
    const existingRatings = await db.select().from(ratings);
    console.log(`Current ratings in database: ${existingRatings.length}`);
    
    // Generate 8 new sample ratings
    const sampleRatings = generateSampleRatings();
    console.log(`Generated ${sampleRatings.length} new sample ratings`);
    
    console.log('\nAdding ratings to database...');
    
    // Insert all ratings
    let addedCount = 0;
    for (const rating of sampleRatings) {
      try {
        await db.insert(ratings).values(rating);
        addedCount++;
        console.log(`   Added rating from ${rating.name} (${rating.rating} stars)`);
      } catch (error) {
        console.error(`   Failed to add rating from ${rating.name}:`, error);
      }
    }
    
    console.log('\nSample ratings added successfully!');
    
    // Show final statistics
    const finalRatings = await db.select().from(ratings);
    console.log('\nFinal Database Statistics:');
    console.log(`   Total ratings: ${finalRatings.length}`);
    console.log(`   New ratings added: ${addedCount}`);
    
    // Show distribution by rating
    const ratingCounts: Record<number, number> = {};
    finalRatings.forEach(rating => {
      ratingCounts[rating.rating] = (ratingCounts[rating.rating] || 0) + 1;
    });
    
    console.log('\nDistribution by Rating:');
    Object.entries(ratingCounts).forEach(([rating, count]) => {
      console.log(`   ${rating} stars: ${count} ratings`);
    });
    
    // Show distribution by status
    const statusCounts: Record<string, number> = {};
    finalRatings.forEach(rating => {
      const status = rating.status || 'No Status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\nDistribution by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} ratings`);
    });
    
    // Calculate average rating
    const totalRating = finalRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = (totalRating / finalRatings.length).toFixed(2);
    console.log(`\nAverage Rating: ${averageRating} stars`);
    
    console.log('\n🎉 Sample ratings added successfully!');
    
    return true;
    
  } catch (error) {
    console.error('Error adding sample ratings:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  addSampleRatings().then(success => {
    if (success) {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    } else {
      console.log('\n❌ Script failed');
      process.exit(1);
    }
  });
}

export { addSampleRatings };
