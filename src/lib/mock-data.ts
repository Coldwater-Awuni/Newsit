import type { BlogPost } from './types';

export const CATEGORIES = ['Technology', 'Science', 'Lifestyle', 'Travel', 'Business', 'News'];
export const TAGS = ['Innovation', 'Research', 'Health', 'Adventure', 'Startups', 'AI', 'Space', 'Productivity', 'Breaking', 'Updates'];

export const BLOG_POSTS: BlogPost[] = [
  {
    _id: '1',
    slug: 'the-future-of-ai',
    title: 'The Future of Artificial Intelligence: Trends to Watch',
    excerpt: 'AI is rapidly evolving. Discover the key trends that will shape its future and impact various industries.',
    content: `
      <p>Artificial Intelligence (AI) is no longer a futuristic concept; it's a transformative force reshaping our world. From healthcare to finance, AI applications are becoming increasingly sophisticated. In this post, we'll explore some of the most significant trends to watch in the coming years.</p>
      <h2>1. Generative AI</h2>
      <p>Generative AI, capable of creating new content like text, images, and even code, is booming. Models like GPT-4 and DALL-E 2 are just the beginning. Expect more powerful and accessible generative tools.</p>
      <img src="https://picsum.photos/seed/ai-content/800/400" alt="Generative AI concept" data-ai-hint="AI concept" class="my-4 rounded-md shadow-md" />
      <h2>2. AI in Healthcare</h2>
      <p>AI is revolutionizing medical diagnosis, drug discovery, and personalized treatment plans. Predictive analytics can help identify diseases earlier, leading to better patient outcomes.</p>
      <h2>3. Ethical AI and Governance</h2>
      <p>As AI becomes more powerful, the need for ethical guidelines and robust governance frameworks is paramount. Addressing bias, ensuring transparency, and maintaining accountability are key challenges.</p>
      <p>The journey of AI is just beginning. Its potential to solve complex problems and create new opportunities is immense, but it requires careful navigation and responsible development.</p>
    `,
    summary: 'A comprehensive look at the future of AI and its impact across industries.',
    imageUrl: 'https://picsum.photos/seed/ai/1200/800',
    author: { name: 'Dr. Ada Lovelace', avatarUrl: 'https://picsum.photos/seed/ada/100/100' },
    publishDate: '2024-07-15T10:00:00Z',
    tags: ['AI', 'Innovation', 'Technology'],
    category: 'Technology',
    featured: true,
    status: 'published',
  },
  {
    _id: '2',
    slug: 'exploring-the-cosmos',
    title: 'Exploring the Cosmos: New Discoveries in Space',
    excerpt: 'Recent advancements in telescopes and space missions have unveiled breathtaking new insights into our universe.',
    content: `
      <p>The universe is a vast and mysterious place, and humanity's quest to understand it continues to yield astonishing discoveries. With powerful new telescopes like the James Webb Space Telescope (JWST), we are peering further back in time and with greater clarity than ever before.</p>
      <h2>Exoplanets and the Search for Life</h2>
      <p>Scientists are discovering exoplanets at an accelerating rate. Some of these distant worlds reside in the habitable zones of their stars, raising the tantalizing possibility of extraterrestrial life.</p>
      <img src="https://picsum.photos/seed/space-content/800/400" alt="Exoplanet concept" data-ai-hint="galaxy stars" class="my-4 rounded-md shadow-md" />
      <h2>Mysteries of Dark Matter and Dark Energy</h2>
      <p>The majority of the universe's mass and energy is composed of dark matter and dark energy, enigmatic substances that we are only beginning to understand. Unraveling their nature is one of the biggest challenges in modern cosmology.</p>
      <p>Our journey through the cosmos is a testament to human curiosity and ingenuity. Each new discovery opens up further questions, pushing the boundaries of our knowledge.</p>
    `,
    imageUrl: 'https://picsum.photos/seed/space/1200/800',
    author: { name: 'Carl Sagan Jr.', avatarUrl: 'https://picsum.photos/seed/carl/100/100' },
    publishDate: '2024-07-10T14:30:00Z',
    tags: ['Space', 'Science', 'Research'],
    category: 'Science',
    featured: true,
    status: 'published',
  },
  {
    _id: '3',
    slug: 'mindful-living-in-a-digital-age',
    title: 'Mindful Living in a Digital Age: Finding Balance',
    excerpt: 'In our hyper-connected world, practicing mindfulness can help reduce stress and improve overall well-being.',
    content: `
      <p>The digital age has brought incredible connectivity and convenience, but it has also introduced new stressors. Constant notifications, information overload, and the pressure to be always online can take a toll on our mental health. Mindfulness offers a path to reclaim our attention and find balance.</p>
      <h2>What is Mindfulness?</h2>
      <p>Mindfulness is the practice of paying attention to the present moment without judgment. It can involve meditation, breathing exercises, or simply being more aware of your thoughts, feelings, and surroundings.</p>
      <img src="https://picsum.photos/seed/mindful-content/800/400" alt="Mindfulness concept" data-ai-hint="meditation nature" class="my-4 rounded-md shadow-md" />
      <h2>Benefits of Mindfulness</h2>
      <ul>
        <li>Reduced stress and anxiety</li>
        <li>Improved focus and concentration</li>
        <li>Enhanced self-awareness</li>
        <li>Better emotional regulation</li>
      </ul>
      <p>Incorporating small mindfulness practices into your daily routine can make a big difference. Whether it's a five-minute meditation or simply taking a few deep breaths before checking your email, these moments of presence can help you navigate the complexities of the digital world with greater ease and clarity.</p>
    `,
    imageUrl: 'https://picsum.photos/seed/mindful/1200/800',
    author: { name: 'Elena Ray', avatarUrl: 'https://picsum.photos/seed/elena/100/100' },
    publishDate: '2024-06-28T09:00:00Z',
    tags: ['Health', 'Productivity', 'Lifestyle'],
    category: 'Lifestyle',
    status: 'published',
  },
  {
    _id: '4',
    slug: 'the-rise-of-sustainable-travel',
    title: 'The Rise of Sustainable Travel: Exploring Responsibly',
    excerpt: 'More travelers are seeking eco-friendly and culturally sensitive ways to explore the world. What does sustainable travel really mean?',
    content: `
      <p>Travel broadens our horizons and enriches our lives, but it can also have significant environmental and social impacts. Sustainable travel aims to minimize these negative effects while maximizing the benefits for local communities and ecosystems.</p>
      <h2>Principles of Sustainable Travel</h2>
      <ul>
        <li>Respecting local cultures and traditions</li>
        <li>Supporting local economies</li>
        <li>Minimizing environmental footprint (reducing waste, conserving water and energy)</li>
        <li>Protecting biodiversity and natural heritage</li>
      </ul>
      <img src="https://picsum.photos/seed/travel-content/800/400" alt="Sustainable travel concept" data-ai-hint="nature mountains" class="my-4 rounded-md shadow-md" />
      <h2>Making a Difference</h2>
      <p>Choosing eco-friendly accommodations, offsetting carbon emissions, supporting local businesses, and being mindful of your resource consumption are just a few ways to travel more sustainably. Every small action contributes to a larger positive impact.</p>
      <p>As global citizens, we have a responsibility to protect the planet and its diverse cultures. Sustainable travel is not just a trend; it's a necessary evolution in how we experience the world.</p>
    `,
    imageUrl: 'https://picsum.photos/seed/travel/1200/800',
    author: { name: 'Marco Polo II', avatarUrl: 'https://picsum.photos/seed/marco/100/100' },
    publishDate: '2024-06-15T11:00:00Z',
    tags: ['Adventure', 'Travel', 'Lifestyle'],
    category: 'Travel',
    status: 'published',
  },
  {
    _id: '5',
    slug: 'mastering-remote-work',
    title: 'Mastering Remote Work: Productivity and Well-being',
    excerpt: 'Remote work is the new norm for many. Learn effective strategies to stay productive, connected, and maintain a healthy work-life balance.',
    content: `
      <p>The shift to remote work has been transformative, offering flexibility but also presenting unique challenges. Mastering remote work involves creating a conducive environment, establishing routines, and prioritizing well-being.</p>
      <h2>Setting Up Your Workspace</h2>
      <p>A dedicated, ergonomic workspace is crucial. Minimize distractions and ensure you have the tools you need to work efficiently.</p>
      <img src="https://picsum.photos/seed/remote-content/800/400" alt="Remote work setup" data-ai-hint="desk computer" class="my-4 rounded-md shadow-md" />
      <h2>Time Management and Communication</h2>
      <p>Effective time management techniques like the Pomodoro Technique can boost productivity. Clear and consistent communication with your team is also vital. Utilize video calls, instant messaging, and project management tools effectively.</p>
      <h2>Prioritizing Well-being</h2>
      <p>Set boundaries between work and personal life. Take regular breaks, stay active, and maintain social connections, even if virtual. Preventing burnout is key to long-term remote work success.</p>
      <p>Remote work, when managed well, can lead to increased productivity, better work-life integration, and greater job satisfaction. It requires discipline, self-awareness, and a proactive approach to both work and well-being.</p>
    `,
    imageUrl: 'https://picsum.photos/seed/remote/1200/800',
    author: { name: 'Alex Chen', avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
    publishDate: '2024-05-20T16:00:00Z',
    tags: ['Productivity', 'Lifestyle', 'Business'],
    category: 'Business',
    status: 'draft',
  },
  {
    _id: '6',
    slug: 'latest-tech-breakthroughs',
    title: 'Breaking News: Latest Tech Breakthroughs of the Month',
    excerpt: 'Stay updated with the most recent advancements in the tech world, from AI to quantum computing.',
    content: `
      <p>This month has been exciting for technology enthusiasts! We've seen major announcements and breakthroughs across various fields.</p>
      <h2>Quantum Leap</h2>
      <p>A new development in quantum computing promises to solve complex problems faster than ever before. Researchers have successfully demonstrated a more stable qubit, paving the way for larger and more reliable quantum computers.</p>
      <img src="https://placehold.co/800x400.png" alt="Quantum computing concept" data-ai-hint="quantum computer" class="my-4 rounded-md shadow-md" />
      <h2>AI for Good</h2>
      <p>An innovative AI model was unveiled that can predict natural disasters with higher accuracy, potentially saving lives and resources. This highlights the positive impact AI can have on society.</p>
      <p>These are just a couple of highlights. The pace of technological innovation continues to accelerate, and we'll be here to cover the most important developments.</p>
    `,
    imageUrl: 'https://placehold.co/1200x800.png',
    author: { name: 'Inkling News Team', avatarUrl: 'https://placehold.co/100x100.png' },
    publishDate: new Date().toISOString(), // Sets to current date
    tags: ['Breaking', 'Updates', 'Technology', 'AI'],
    category: 'News',
    featured: false,
    status: 'published',
  }
];


