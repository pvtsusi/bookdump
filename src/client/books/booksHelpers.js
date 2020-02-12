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

export function deleteReserver(books, isbn) {
  return (books || []).map((book) => {
    if (book.isbn === isbn) {
      const clearedBook = {};
      for (const key of Object.keys(book)) {
        if (key !== 'reserver' && key !== 'reserverName') {
          clearedBook[key] = book[key];
        }
      }
      return clearedBook;
    } else {
      return book;
    }
  });
}

export function deleteBooks(books, reserver) {
  return (books || []).filter((book) => book.reserver !== reserver);
}

export function groupByReserver(books) {
  return (books || [])
    .filter(book => book.reserver)
    .reduce((acc, curr) => {
      (acc[curr.reserver] = acc[curr.reserver] || []).push(curr);
      return acc;
    }, {});
}

export function existingReservations(books) {
  const reservations = {};
  for (const book of (books || [])) {
    if (book.reserver) {
      reservations[book.isbn] = 'exists';
    }
  }
  return reservations;
}

function surname(fullName) {
  const parts = fullName.split(/\s+/);
  return parts[parts.length - 1];
}

function sortableTitle(title) {
  const parts = title.split(/\s+/);
  // Uhh..
  const articles = ['a', 'an', 'the', 'en', 'ett', 'un', 'une', 'le', 'la', 'les'];
  if (parts.length > 1 && articles.includes(parts[0].toLowerCase())) {
    parts.shift();
    return parts.join(' ');
  }
  return title;
}

export function sortedByAuthor(books) {
  return (books || []).slice().sort((a, b) => {
    const surnameComparison = surname(a.author).localeCompare(surname(b.author));
    if (surnameComparison !== 0) {
      return surnameComparison;
    }
    const nameComparison = a.author.localeCompare(b.author);
    if (nameComparison !== 0) {
      return nameComparison;
    }
    return sortableTitle(a.title).localeCompare(sortableTitle(b.title));
  });
}

export function upsert(books, book) {
  const upserted = (books || []).filter((b) => b.isbn !== book.isbn);
  upserted.push(book);
  return sortedByAuthor(upserted);
}