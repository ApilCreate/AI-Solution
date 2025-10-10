import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogs } from '../db/schema';

const connectionString = process.env.DATABASE_URL!;
const client = neon(connectionString);
const db = drizzle(client);

async function addSampleBlog() {
  console.log('Adding sample blog...');
  
  try {
    await db.insert(blogs).values({
      title: "Welcome to Our AI Blog",
      content: `# Welcome to Our AI Blog

This is our first blog post! We're excited to share insights about artificial intelligence, machine learning, and the future of technology.

## What You'll Find Here

- Latest AI trends and developments
- Technical tutorials and guides
- Industry analysis and predictions
- Expert interviews and insights

## Getting Started

Our blog covers a wide range of topics from beginner-friendly introductions to advanced technical deep-dives. Whether you're just starting your AI journey or you're an experienced practitioner, you'll find valuable content here.

### Categories We Cover

1. **Machine Learning Fundamentals**
2. **Deep Learning Applications**
3. **AI Ethics and Governance**
4. **Industry Case Studies**
5. **Future Predictions**

Stay tuned for regular updates and don't forget to subscribe to our newsletter for the latest posts!`,
      excerpt: "Our inaugural blog post introducing what you can expect from our AI-focused content platform.",
      author: "AI Solutions Team",
      image: "/images/ai-blog-hero.jpg",
      category: "Welcome",
      tags: ["AI", "Introduction", "Welcome"],
      readTime: "3 min read",
      status: "published",
      publishedAt: new Date()
    });

    console.log('Sample blog added successfully!');
  } catch (error) {
    console.error('Error adding sample blog:', error);
  }
}

addSampleBlog();