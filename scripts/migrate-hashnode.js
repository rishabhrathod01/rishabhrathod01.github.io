const fs = require('fs');
const path = require('path');

// Read the Hashnode export JSON
const hashnodeData = JSON.parse(
  fs.readFileSync(
    '/Users/rishabhrathod/Downloads/5fc746446819c54efdf2d66b-articles.json',
    'utf-8'
  )
);

// Create content/blog directory if it doesn't exist
const blogDir = path.join(__dirname, '../content/blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Function to calculate reading time from markdown
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

// Function to create MDX frontmatter
function createFrontmatter(post) {
  const tags = post.tags || [];
  const tagNames = tags.map((tagId) => {
    // Map common tag IDs to names (you can expand this)
    const tagMap = {
      '56744722958ef13879b94f4d': 'React Native',
      '56744723958ef13879b95338': 'Animation',
      '569cd00972ca04ea5d79fca2': 'JavaScript',
      '58cb5f69ecb020d9744a6487': 'Tutorial',
      '56744721958ef13879b94cad': 'React',
      '57ebac0bd9b08ec06a77be05': 'Web Development',
      '57778738f271844db9e1eb41': 'Low Code',
      '56744721958ef13879b94e0c': 'Tools',
    };
    return tagMap[tagId] || 'Tech';
  });

  return `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${formatDate(post.dateAdded)}"
description: "${(post.brief || post.metaDescription || '').replace(/"/g, '\\"').substring(0, 200)}"
coverImage: "${post.coverImage || ''}"
tags: [${tagNames.map((tag) => `"${tag}"`).join(', ')}]
author: "Rishabh Rathod"
---

`;
}

// Process each post
hashnodeData.posts.forEach((post, index) => {
  console.log(`\nProcessing post ${index + 1}: ${post.title}`);

  // Create frontmatter
  const frontmatter = createFrontmatter(post);

  // Get markdown content (prefer contentMarkdown over HTML content)
  let content = post.contentMarkdown || post.content || '';

  // Clean up embed blocks that won't work in MDX
  content = content.replace(/%\[https:\/\/[^\]]+\]/g, (match) => {
    const url = match.match(/https:\/\/[^\]]+/)[0];
    return `\n[🔗 View on ${new URL(url).hostname}](${url})\n`;
  });

  // Clean up gist embeds
  content = content.replace(
    /%\[https:\/\/gist\.github\.com\/[^\]]+\]/g,
    (match) => {
      const url = match.match(/https:\/\/[^\]]+/)[0];
      return `\n[📝 View Gist](${url})\n`;
    }
  );

  // Combine frontmatter and content
  const mdxContent = frontmatter + content;

  // Create filename from slug
  const filename = `${post.slug}.mdx`;
  const filepath = path.join(blogDir, filename);

  // Write the MDX file
  fs.writeFileSync(filepath, mdxContent, 'utf-8');

  console.log(`✅ Created: ${filename}`);
  console.log(`   - Date: ${formatDate(post.dateAdded)}`);
  console.log(`   - Views: ${post.views}`);
  console.log(`   - Reading time: ${post.readTime || calculateReadingTime(content)} min`);
});

console.log(`\n🎉 Migration complete! ${hashnodeData.posts.length} posts migrated.`);
console.log(`\n📁 Check your blog posts at: ${blogDir}`);

