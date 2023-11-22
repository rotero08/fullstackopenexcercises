const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
      
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (acc, blog) => {
        if (!acc || (blog.likes && blog.likes > acc.likes)) {
            return blog;
          }
        return acc;
    }

    mostLiked = null

    blogs.length === 0
        ? 0
        : mostLiked = blogs.reduce(reducer, null)
    
        return mostLiked ? { title: mostLiked.title, author: mostLiked.author, likes: mostLiked.likes } : null;
}

function mostBlogs(blogs) {
    const blogCounts = {};
  
    blogs.forEach(blog => {
      if (blogCounts[blog.author]) {
        blogCounts[blog.author]++;
      } else {
        blogCounts[blog.author] = 1;
      }
    });
  
    let maxBlogs = 0;
    let topAuthor = '';
  
    for (const author in blogCounts) {
      if (blogCounts[author] > maxBlogs) {
        maxBlogs = blogCounts[author];
        topAuthor = author;
      }
    }
  
    return topAuthor ? { author: topAuthor, blogs: maxBlogs } : null;
}

function mostLikes(blogs) {
    const blogCounts = {};
  
    blogs.forEach(blog => {
      if (blogCounts[blog.author]) {
        blogCounts[blog.author] += blog.likes;
      } else {
        blogCounts[blog.author] = blog.likes;
      }
    });
  
    let maxLikes = 0;
    let topAuthor = '';
  
    for (const author in blogCounts) {
      if (blogCounts[author] > maxLikes) {
        maxLikes = blogCounts[author];
        topAuthor = author;
      }
    }
  
    return topAuthor ? { author: topAuthor, likes: maxLikes } : null;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}