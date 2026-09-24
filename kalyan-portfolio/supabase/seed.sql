-- Kalyan Portfolio — seed data
-- Run after schema.sql. Safe to re-run: it clears each table first.
-- All content here comes directly from the brief — nothing invented.

truncate table project_images, projects, skills, social_links, education,
  certifications, dsa_stats, resume, about, site_settings restart identity cascade;

insert into site_settings (site_title, meta_description) values (
  'M Hemasatya Kalyan | Full-Stack Developer & AI/GenAI Developer',
  'Full-stack and AI/GenAI developer portfolio of M Hemasatya Kalyan — React, Node.js, Python, LLMs and RAG.'
);

insert into about (
  name, title, location, email, phone, avatar_url,
  hero_heading, hero_description, about_text, career_goal
) values (
  'M Hemasatya Kalyan',
  'Full-Stack Developer & AI/GenAI Developer',
  'Hyderabad, India',
  'kalyancodes.dev@gmail.com',
  '+91 9381130142',
  null,
  E'Hi, I\'m Kalyan.',
  'I build modern web applications and AI-powered solutions using technologies such as React, Node.js, Python, LLMs, and RAG.',
  'I am a B.Tech Computer Science and Engineering graduate based in Hyderabad, India. I build full-stack web applications and AI-powered applications, with experience across React, JavaScript, Python, Node.js, Express.js, MongoDB, REST APIs, LLM integration, Retrieval-Augmented Generation (RAG), prompt engineering, embeddings, semantic retrieval, and document processing. I enjoy turning ideas into practical applications and continuously improving my software development and problem-solving skills.',
  'Become a strong and capable software developer.'
);

insert into social_links (platform, label, url, display_order) values
  ('github', 'GitHub', 'https://github.com/kalyan-dev01', 1),
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/kalyan-m-7782ab375/', 2),
  ('leetcode', 'LeetCode', 'https://leetcode.com/u/bxTynzdW9r/', 3),
  ('email', 'Email', 'mailto:kalyancodes.dev@gmail.com', 4);

insert into skills (category, name, display_order) values
  ('Languages', 'JavaScript', 1),
  ('Languages', 'Python', 2),
  ('Frontend', 'React.js', 1),
  ('Frontend', 'HTML5', 2),
  ('Frontend', 'CSS3', 3),
  ('Frontend', 'Tailwind CSS', 4),
  ('Backend', 'Node.js', 1),
  ('Backend', 'Express.js', 2),
  ('Backend', 'REST APIs', 3),
  ('Backend', 'JWT Authentication', 4),
  ('AI / GenAI', 'LLM Integration', 1),
  ('AI / GenAI', 'Retrieval-Augmented Generation (RAG)', 2),
  ('AI / GenAI', 'Prompt Engineering', 3),
  ('AI / GenAI', 'Embeddings', 4),
  ('AI / GenAI', 'Semantic Retrieval', 5),
  ('AI / GenAI', 'Document Processing', 6),
  ('AI / GenAI', 'NLP Fundamentals', 7),
  ('Database', 'MongoDB', 1),
  ('Database', 'Mongoose', 2),
  ('Tools', 'Git', 1),
  ('Tools', 'GitHub', 2),
  ('Tools', 'VS Code', 3),
  ('Tools', 'Postman', 4);

insert into projects (
  slug, name, short_description, detailed_description, thumbnail_url,
  technologies, features, github_url, live_url, featured, published, display_order
) values (
  'mindmock-ai',
  'MindMock AI',
  'An AI-powered learning platform that generates quizzes from learning topics and study material.',
  'MindMock AI is an AI-powered learning platform that generates quizzes from learning topics and study material, aimed at making self-testing faster to set up and more focused on what a learner actually needs to review.',
  null,
  '{}',
  array[
    'AI-powered quiz generation',
    'Topic-based quiz generation',
    'Study material / PDF-based quiz generation',
    'Interactive learning experience'
  ],
  null,
  'https://mock-mind-ai-beta.vercel.app/',
  true, true, 1
), (
  'docubot-rag-service',
  'DocuBot RAG Service',
  'A Retrieval-Augmented Generation document question-answering system.',
  'DocuBot RAG Service is a Retrieval-Augmented Generation system for answering questions over documents: it processes and chunks documents, generates embeddings, retrieves the most relevant context for a query, and passes that context to an LLM to produce a grounded answer.',
  null,
  '{}',
  array[
    'Document loading and preprocessing',
    'PDF/document text extraction',
    'Text chunking',
    'Embedding generation',
    'Semantic retrieval of relevant document chunks',
    'Passing retrieved context to an LLM',
    'Grounded, context-aware answer generation',
    'Improving retrieval relevance through chunking/retrieval refinement'
  ],
  'https://github.com/kalyan-dev01/docubot-rag-service',
  null,
  true, true, 2
), (
  'book-metadata-web-scraper',
  'Book Metadata Web Scraper',
  'A Python-based web scraping project that collects structured book information from web pages.',
  'A Python-based web scraping project using Beautiful Soup and HTML parsing to collect structured information from web pages, converting raw page content into structured book data.',
  null,
  '{}',
  array[
    'Web scraping',
    'HTML parsing',
    'Structured data extraction',
    'Extracts book titles, authors, and metadata/content',
    'Converts web-page information into structured data'
  ],
  null,
  null,
  false, true, 3
);

insert into education (degree, field, institution, location, start_date, end_date, cgpa, display_order)
values (
  'Bachelor of Technology',
  'Computer Science and Engineering',
  'Malla Reddy College of Engineering & Technology',
  'Hyderabad',
  '2022-10',
  '2026-04',
  '7.55/10',
  1
);

insert into certifications (name, display_order) values
  ('Python for Everybody', 1),
  ('Full Stack Development Certification', 2);

insert into dsa_stats (problems_solved, leetcode_url, description) values (
  150,
  'https://leetcode.com/u/bxTynzdW9r/',
  'Regularly practicing Data Structures and Algorithms to strengthen problem-solving skills, programming fundamentals, and logical thinking.'
);

insert into resume (file_url, file_name) values (null, null);
