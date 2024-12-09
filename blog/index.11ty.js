import fs from 'fs';
import getPosts from '../build.js';

export default function() {
  const cssFileName = fs.readdirSync('./dist/assets/').find((file) => file.includes('.css'));

  const posts = getPosts();
  
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/${cssFileName}" />
    <title>The Mages' Blog</title>
    <link rel="icon" href="/favicon.png" />
  </head>
  <body class="flex flex-col justify-between min-h-screen">
    <div id="content" class="flex flex-col w-full mb-14">
      <div class="w-10/12 mx-auto pt-6">
        <h2 class="text-8xl font-bold">Blog</h2>
        <hr class="w-1/2" />
        <div class="ml-5 mt-5">
          <p class="text-2xl">Welcome to our blog! Here you can find the latest news and updates from the Three Little Mages.</p>
        </div>
        <div class="flex">
          <a href="/" class="text-lg bg-gray-950 bg-opacity-40 p-4 mt-4 rounded-xl">← Return to home</a>
        </div>
        <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-x-md gap-y-xl mt-8">
          ${posts.map(post => `
            <a href="/blog/${post.url}">
              <article class="flex flex-col bg-gray-950 bg-opacity-40 w-96 h-full p-6 rounded-xl">
                <h3 class="text-4xl font-bold pb-2">${post.title}</h3>
                <div class="w-10/12 flex items-center ml-auto">
                  <hr class="flex-grow border-gray-400"/><span class="w-2"></span><span class="text-gray-400">${post.date}</span>
                </div>
                <p class="text-lg indent-8 h-72 pt-2 overflow-hidden text-ellipsis whitespace-normal italic" style="display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical;">"${post.previewContent}...<p>
              </article>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
    <footer class="mt-4">
      <div class="flex justify-center bg-gray-950 bg-opacity-40 p-4">
        <p class="text-sm">© 2024 Three Little Mages - All rights reserved.</p>
      </div>
    </footer>
  </body>
  `;
}