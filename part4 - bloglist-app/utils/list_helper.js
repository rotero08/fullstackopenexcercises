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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}