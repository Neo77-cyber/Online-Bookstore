function generateRandomBook() {
    const titles = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
    const authors = ["Author 1", "Author 2", "Author 3", "Author 4", "Author 5"];
    const genres = ["Fiction", "Non-fiction", "Mystery", "Science Fiction", "Fantasy", "Romance"];
  
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
  
    return {
      title: randomTitle,
      author: randomAuthor,
      genre: randomGenre,
    };
  }
  
  const books = [];
  for (let i = 0; i < 10000; i++) {
    books.push(generateRandomBook());
  }
  
  module.exports = books;
  