
export const config = {
  dir: {
    input: "blog/",
    output: "dist/blog"
  }
};

export default function(eleventyConfig) {
  eleventyConfig.addFilter("date", function(date) {
    return new Date(date).toDateString();
  });
}
