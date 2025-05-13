import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Inkling Insights',
  description: 'Learn more about Inkling Insights and our mission.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">About Inkling Insights</h1>
      
      <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image 
          src="https://picsum.photos/seed/aboutus/1200/675" 
          alt="Team working together" 
          fill 
          className="object-cover"
          data-ai-hint="team collaboration"
        />
      </div>

      <div className="prose dark:prose-invert prose-lg max-w-none">
        <p>
          Welcome to Inkling Insights, your daily destination for thought-provoking articles, in-depth analyses, and fresh perspectives on a wide array of topics. We believe in the power of knowledge to inspire, educate, and foster understanding.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to provide high-quality, engaging content that sparks curiosity and encourages critical thinking. We strive to cover subjects ranging from cutting-edge technology and scientific breakthroughs to lifestyle trends, travel adventures, and business innovations.
        </p>

        <h2>What We Do</h2>
        <p>
          At Inkling Insights, we curate and create content designed to be both informative and enjoyable. Our team of writers and editors are passionate about their respective fields, ensuring that each article is well-researched, clearly written, and offers valuable insights.
        </p>
        
        <h2>Join Our Community</h2>
        <p>
          We're more than just a blog; we're a community of curious minds. We encourage you to engage with our content, share your thoughts in the comments, and connect with us on social media. Your perspective is valuable, and we look forward to learning and growing together.
        </p>
        <p>
          Thank you for being a part of Inkling Insights. We hope you find inspiration and knowledge with every visit.
        </p>
      </div>
    </div>
  );
}
