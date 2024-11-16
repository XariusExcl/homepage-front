import fs from 'fs';

// Read the build directory to get the name of the CSS file to add to the blogpost template
const buildDir = fs.readdirSync('dist/assets');
const cssFileName = buildDir.find((file) => file.includes('.css'));
const blogPostTemplateFile = fs.readFileSync('blog/_includes/blogpost.njk', 'utf8');
const blogpostTemplateContent = blogPostTemplateFile.replace(/href="\/assets\/.*\.css"/, `href="/assets/${cssFileName}"`);
fs.writeFileSync('blog/_includes/blogpost.njk', blogpostTemplateContent, 'utf8');

// Read the blog directory to get the list of blog posts
const getPosts = () => {
  const posts = [];
  fs.readdirSync('./blog/').map(fileName => {
    if (fileName.endsWith('.md')) {
      const fileContent = fs.readFileSync(`./blog/${fileName}`).toString();
      const frontMatter = fileContent.split('---')[1];
      if (!frontMatter.includes('title: ') || !frontMatter.includes('date: ')) {
        throw new Error(`File ${fileName} is missing required front matter fields (title, date).`);
      }

      if (frontMatter.includes('visibility: ') && frontMatter.split('visibility: ')[1].split('\n')[0].includes('hidden'))
        return;

      posts.push({
        url: fileName.replace('.md', ''),
        title: frontMatter.split('title: ')[1].split('\n')[0],
        date: frontMatter.split('date: ')[1].split('\n')[0],
        previewContent: fileContent.split('---')[2].replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, '').trim().slice(0, 500)
      });
    }
  });
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// Update the built index file with the latest blog posts
const indexFile = fs.readFileSync('./dist/index.html', 'utf8');
const updatedIndexFile = indexFile.replace(/{{ \$blogposts }}/s, getPosts().map(post => `
  <a href="/blog/${post.url}" style="margin-right:2.5rem;">
    <article class="flex flex-col bg-gray-950 bg-opacity-40 w-96 h-full p-6 rounded-xl">
      <h3 class="text-4xl font-bold pb-2">${post.title}</h3>
        <div class="w-10/12 flex items-center ml-auto">
          <hr class="flex-grow border-gray-400"/><span class="w-2"></span><span class="text-gray-400">${post.date}</span>
        </div>
      <p class="text-lg indent-8 h-72 pt-2 overflow-hidden text-ellipsis whitespace-normal italic" style="display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical;">"${post.previewContent}...<p>
    </article>
  </a>
`).join(''));

// Write the updated index file
fs.writeFileSync('./dist/index.html', updatedIndexFile, 'utf8');

export default getPosts;