import React from 'react';

const Book = props => {
  const book = props.book;

  return (
    <div>
      <span>
        {book.author}
      </span>
      <span>
        {book.title}
      </span>
    </div>
  );
};

export default Book;
