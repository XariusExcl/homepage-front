import markdownIt from "markdown-it";
import markdownItContainer from "markdown-it-container";

export const config = {
  dir: {
    input: "blog/",
    output: "dist/blog"
  }
};

export default function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addFilter("date", function(date) {
    return new Date(date).toDateString();
  });
  eleventyConfig.addFilter("kebabCase", function(content) {
    return content.replace(/ /g, "-").toLowerCase();
  });
  /*
  let options = {
		html: true,
		breaks: true,
		linkify: true,
	};
  */
 /*
  eleventyConfig.amendLibrary("md", (md) => { md.use(markdownItContainer, "spoiler", {
    validate: function(params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';

      } else {
        // closing tag
        return '</details>\n';
      }
    }
  })});
  */

  
  eleventyConfig.amendLibrary("md", (md) => { md.use(markdownItContainer, "info", { render(tokens, idx) {
    var m = tokens[idx].info.trim().match(/^info\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<blockquote class="info"><div class="flex" style="padding-top:1rem"> <svg style="position:relative; height:1rem; width:1rem; top:.25rem; margin-right:.25rem;" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#3b82f6;}</style></defs><title>shapes</title><path class="cls-1" d="M23,47A22,22,0,0,1,6.67,39.71,3.5,3.5,0,0,1,9.75,33.9,8.78,8.78,0,0,0,11,34a9,9,0,0,0,0-18,8.78,8.78,0,0,0-1.25.1,3.5,3.5,0,0,1-3.08-5.81A22,22,0,1,1,23,47Zm-4.7-7.76a15,15,0,1,0,0-28.48,16,16,0,0,1,0,28.48Z"/></svg><b>Info</b></div>';

    } else {
      // closing tag
      return '</blockquote>\n';
    }
  }})});
}
