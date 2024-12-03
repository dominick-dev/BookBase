export const getFallbackCover = (title) => {
  return `https://placehold.co/100x150?text=${encodeURIComponent(title)}&font=Lato.png`;
};

export const getBookDetails = (book) => {
  // console.log("getBookDetails function is called with book:", book);
  return {
    title: book.title || "No title available",
    author: book.author || "No author available",
    description: book.description || "No description available",
    averageRating: book.avg_review || 0,
    image: book.image || getFallbackCover(book.title || "No title available"),
    isbn: book.isbn || "No ISBN available",
  };
};
