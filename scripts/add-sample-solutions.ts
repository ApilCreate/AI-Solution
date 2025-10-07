import { db } from '../db';
import { solutions } from '../db/schema';

const sampleSolutions = [
  {
    title: "AI Analytics Services",
    description: "Transform your business intelligence with our advanced AI analytics platform. Our solution provides real-time insights, predictive analytics, and automated reporting that helps businesses make data-driven decisions faster than ever before.",
    shortDescription: "Advanced AI-powered analytics for real-time business insights and predictive reporting",
    category: "Analytics Services",
    features: [
      "Real-time data processing",
      "Predictive modeling",
      "Automated reporting",
      "Custom dashboard creation",
      "Machine learning algorithms",
      "Data visualization tools"
    ],
    benefits: [
      "40% faster decision making",
      "Reduced manual reporting time",
      "Improved accuracy in forecasting",
      "Cost-effective data analysis"
    ],
    useCases: [
      "Sales forecasting",
      "Customer behavior analysis",
      "Market trend prediction",
      "Performance optimization",
      "Risk assessment"
    ],
    pricing: "Starting at $299/month",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    iconName: "BarChart3",
    status: "published" as const,
    featured: true,
    sortOrder: 1
  },
  {
    title: "Data Cleaning & Processing",
    description: "Streamline your data pipeline with our intelligent data cleaning and processing solutions. Our AI-powered platform automatically identifies and corrects data inconsistencies, handles missing values, and prepares your data for analysis.",
    shortDescription: "Automated data cleaning and processing with AI-powered quality assurance",
    category: "Data Processing",
    features: [
      "Automated data validation",
      "Missing value imputation",
      "Duplicate detection",
      "Data transformation",
      "Quality scoring",
      "Real-time monitoring"
    ],
    benefits: [
      "90% reduction in data errors",
      "Automated quality checks",
      "Faster data preparation",
      "Consistent data standards"
    ],
    useCases: [
      "Customer database cleaning",
      "Sales data processing",
      "Inventory management",
      "Financial data validation"
    ],
    pricing: "Starting at $199/month",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    iconName: "Database",
    status: "published" as const,
    featured: false,
    sortOrder: 2
  },
  {
    title: "AI Agent Development",
    description: "Build intelligent AI agents that can handle complex business processes, customer interactions, and automated workflows. Our platform provides everything you need to create, train, and deploy sophisticated AI agents.",
    shortDescription: "Custom AI agents for business process automation and customer interaction",
    category: "AI Agent Development",
    features: [
      "Natural language processing",
      "Multi-channel deployment",
      "Learning capabilities",
      "Integration APIs",
      "Custom training models",
      "Performance analytics"
    ],
    benefits: [
      "24/7 automated support",
      "Scalable customer service",
      "Reduced operational costs",
      "Improved response times"
    ],
    useCases: [
      "Customer support bots",
      "Sales assistance agents",
      "Internal process automation",
      "Lead qualification"
    ],
    pricing: "Starting at $399/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "Bot",
    status: "published" as const,
    featured: true,
    sortOrder: 3
  },
  {
    title: "Machine Learning Models",
    description: "Deploy custom machine learning models tailored to your business needs. Our platform supports various ML algorithms and provides tools for model training, validation, and deployment in production environments.",
    shortDescription: "Custom machine learning models for predictive analytics and automation",
    category: "Machine Learning",
    features: [
      "Multiple algorithm support",
      "Automated model training",
      "A/B testing capabilities",
      "Model versioning",
      "Performance monitoring",
      "Auto-scaling deployment"
    ],
    benefits: [
      "Improved prediction accuracy",
      "Automated model updates",
      "Scalable infrastructure",
      "Reduced development time"
    ],
    useCases: [
      "Demand forecasting",
      "Fraud detection",
      "Recommendation systems",
      "Quality control"
    ],
    pricing: "Starting at $599/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "Brain",
    status: "published" as const,
    featured: false,
    sortOrder: 4
  },
  {
    title: "Computer Vision Solutions",
    description: "Implement advanced computer vision capabilities for image recognition, object detection, and visual analysis. Our solutions are perfect for quality control, security monitoring, and automated visual inspection.",
    shortDescription: "Advanced computer vision for image recognition and visual analysis",
    category: "Computer Vision",
    features: [
      "Object detection",
      "Image classification",
      "Real-time processing",
      "Custom model training",
      "Edge deployment",
      "API integration"
    ],
    benefits: [
      "Automated visual inspection",
      "Improved accuracy",
      "Real-time analysis",
      "Reduced manual work"
    ],
    useCases: [
      "Quality control",
      "Security monitoring",
      "Medical imaging",
      "Automated inspection"
    ],
    pricing: "Starting at $499/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "Eye",
    status: "published" as const,
    featured: false,
    sortOrder: 5
  },
  {
    title: "Natural Language Processing",
    description: "Harness the power of natural language processing for text analysis, sentiment detection, and language understanding. Our NLP solutions help businesses extract insights from unstructured text data.",
    shortDescription: "Advanced NLP for text analysis and language understanding",
    category: "Natural Language Processing",
    features: [
      "Sentiment analysis",
      "Text classification",
      "Named entity recognition",
      "Language translation",
      "Text summarization",
      "Chatbot integration"
    ],
    benefits: [
      "Automated text processing",
      "Improved customer insights",
      "Multi-language support",
      "Real-time analysis"
    ],
    useCases: [
      "Customer feedback analysis",
      "Content moderation",
      "Document processing",
      "Language translation"
    ],
    pricing: "Starting at $349/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "FileText",
    status: "published" as const,
    featured: false,
    sortOrder: 6
  },
  {
    title: "Business Process Automation",
    description: "Automate complex business processes with our intelligent automation platform. Reduce manual work, eliminate errors, and increase efficiency across your organization with AI-powered workflow automation.",
    shortDescription: "Intelligent automation for business processes and workflows",
    category: "Automation",
    features: [
      "Workflow automation",
      "Process optimization",
      "Error handling",
      "Integration capabilities",
      "Monitoring dashboard",
      "Custom triggers"
    ],
    benefits: [
      "Reduced manual work",
      "Improved efficiency",
      "Error reduction",
      "Cost savings"
    ],
    useCases: [
      "Invoice processing",
      "Employee onboarding",
      "Customer onboarding",
      "Report generation"
    ],
    pricing: "Starting at $249/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "Settings",
    status: "published" as const,
    featured: false,
    sortOrder: 7
  },
  {
    title: "Predictive Analytics Platform",
    description: "Forecast future trends and behaviors with our advanced predictive analytics platform. Make data-driven decisions with confidence using our sophisticated modeling and forecasting capabilities.",
    shortDescription: "Advanced predictive analytics for forecasting and trend analysis",
    category: "Predictive Analytics",
    features: [
      "Time series forecasting",
      "Anomaly detection",
      "Risk modeling",
      "Scenario planning",
      "Real-time predictions",
      "Model validation"
    ],
    benefits: [
      "Improved forecasting accuracy",
      "Risk mitigation",
      "Better planning",
      "Competitive advantage"
    ],
    useCases: [
      "Sales forecasting",
      "Inventory optimization",
      "Risk assessment",
      "Market analysis"
    ],
    pricing: "Starting at $449/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "TrendingUp",
    status: "published" as const,
    featured: true,
    sortOrder: 8
  },
  {
    title: "Business Intelligence Dashboard",
    description: "Create comprehensive business intelligence dashboards with our AI-powered analytics platform. Visualize your data, track KPIs, and gain actionable insights for strategic decision making.",
    shortDescription: "Comprehensive BI dashboards with AI-powered insights and analytics",
    category: "Business Intelligence",
    features: [
      "Interactive dashboards",
      "KPI tracking",
      "Data visualization",
      "Automated insights",
      "Custom reports",
      "Mobile access"
    ],
    benefits: [
      "Real-time insights",
      "Improved decision making",
      "Automated reporting",
      "Better visibility"
    ],
    useCases: [
      "Executive reporting",
      "Performance monitoring",
      "Financial analysis",
      "Operational metrics"
    ],
    pricing: "Starting at $199/month",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "PieChart",
    status: "published" as const,
    featured: false,
    sortOrder: 9
  },
  {
    title: "Custom AI Solutions",
    description: "Get tailored AI solutions designed specifically for your business needs. Our expert team works with you to develop custom AI applications that solve unique challenges and drive innovation.",
    shortDescription: "Bespoke AI solutions tailored to your specific business requirements",
    category: "Custom AI Solutions",
    features: [
      "Custom development",
      "Industry expertise",
      "Scalable architecture",
      "Ongoing support",
      "Integration services",
      "Training and documentation"
    ],
    benefits: [
      "Tailored solutions",
      "Competitive advantage",
      "Expert guidance",
      "Long-term partnership"
    ],
    useCases: [
      "Industry-specific applications",
      "Unique business challenges",
      "Innovation projects",
      "Digital transformation"
    ],
    pricing: "Custom pricing",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
    iconName: "Sparkles",
    status: "published" as const,
    featured: true,
    sortOrder: 10
  }
];

async function addSampleSolutions() {
  try {
    console.log('Adding sample solutions...');
    
    for (const solution of sampleSolutions) {
      await db.insert(solutions).values(solution);
      console.log(`Added solution: ${solution.title}`);
    }
    
    console.log('Successfully added all sample solutions!');
  } catch (error) {
    console.error('Error adding sample solutions:', error);
  }
}

// Run the script
addSampleSolutions();
