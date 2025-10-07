import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { blogs } from '../db/schema';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL!;
const client = neon(connectionString);
const db = drizzle(client);

async function addMarkdownBlog() {
  console.log('Adding markdown-formatted blog...');
  
  try {
    await db.insert(blogs).values({
      title: "The Future of Artificial Intelligence: Transforming Industries",
      content: `# The Future of Artificial Intelligence: Transforming Industries

Artificial Intelligence (AI) is no longer a concept confined to science fiction. It has become a transformative force reshaping industries across the globe, from healthcare and finance to transportation and entertainment.

## The Current State of AI

Today's AI landscape is characterized by rapid advancements in **machine learning**, **natural language processing**, and **computer vision**. These technologies are enabling unprecedented automation and decision-making capabilities.

### Key Areas of Impact

#### 1. Healthcare Revolution
AI is revolutionizing healthcare through:
- **Diagnostic imaging** with accuracy surpassing human specialists
- **Drug discovery** accelerated by predictive modeling
- **Personalized treatment** plans based on genetic data
- **Remote patient monitoring** through IoT devices

#### 2. Financial Services Transformation
The financial sector is leveraging AI for:
- *Fraud detection* in real-time transactions
- *Algorithmic trading* with microsecond decision-making
- *Credit scoring* using alternative data sources
- *Customer service* through intelligent chatbots

#### 3. Transportation Evolution
Autonomous vehicles and smart transportation systems are:
- Reducing traffic accidents through advanced safety systems
- Optimizing route planning for maximum efficiency
- Enabling predictive maintenance for fleet management
- Creating new mobility-as-a-service business models

## Challenges and Considerations

While AI presents tremendous opportunities, it also brings significant challenges:

### Ethical Implications
- **Bias in algorithms** affecting fair decision-making
- **Privacy concerns** with personal data usage
- **Job displacement** in various industries
- **Accountability** for AI-driven decisions

### Technical Hurdles
- Data quality and availability
- Computational resource requirements
- Model interpretability and explainability
- Integration with existing systems

## Looking Ahead: The Next Decade

The next ten years will see AI becoming even more integrated into our daily lives:

1. **Quantum-enhanced AI** will solve previously impossible problems
2. **Edge AI** will bring intelligence closer to data sources
3. **Federated learning** will enable privacy-preserving AI training
4. **Neuromorphic computing** will create more efficient AI hardware

## Conclusion

As we stand at the threshold of an AI-driven future, it's crucial to approach this technology with both optimism and caution. The key to success lies in developing AI systems that are not only powerful and efficient but also ethical, transparent, and beneficial to all of humanity.

The journey ahead is exciting, challenging, and full of possibilities. By working together—technologists, policymakers, and society at large—we can harness the transformative power of AI to create a better world for everyone.`,
      excerpt: "Explore how artificial intelligence is transforming industries and shaping our future, from healthcare breakthroughs to autonomous transportation.",
      author: "Dr. Sarah Chen",
      image: "/images/ai-future.png",
      category: "AI & Technology",
      tags: ["Artificial Intelligence", "Machine Learning", "Future Tech", "Industry 4.0"],
      readTime: "8 min read",
      status: "published",
      publishedAt: new Date()
    });

    console.log('Markdown blog added successfully!');
  } catch (error) {
    console.error('Error adding markdown blog:', error);
  }
}

addMarkdownBlog();