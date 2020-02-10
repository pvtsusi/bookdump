export function updateBookField(books, isbn, field, value) {
  return (books || []).map((book) => {
    if (book.isbn === isbn) {
      return { ...book, [field]: value };
    } else {
      return book;
    }
  });
}

export function patchBook(books, isbn, patch) {
  return (books || []).map((book) => {
    if (book.isbn === isbn) {
      return { ...book, ...patch };
    } else {
      return book;
    }
  });
}

