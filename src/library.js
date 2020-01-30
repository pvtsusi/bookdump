import rp from 'request-promise-native';

function normalizeAuthor(book) {
  const match = book.author.match(/^([^,]+), *(.+)$/);
  if (match) {
    book.author = `${match[2]} ${match[1]}`;
  }
  return book;
}

export default async function searchFromAll(isbn) {
  return await Promise.all([findFinna(isbn), findOpenLibrary(isbn)]).then((allFound) => {
    return allFound.flat().filter(book => book.title && book.author).map(normalizeAuthor);
  });
}

function findFinna(isbn) {
  const opts = {
    uri: 'https://api.finna.fi/api/v1/search',
    qs: {
      lookfor: `cleanIsbn:${isbn}`,
      type: 'AllFields',
      field: ['languages', 'nonPresenterAuthors', 'title'],
      sort: 'relevance,id asc',
      page: 1,
      limit: 20,
      prettyPrint: 'true',
      lng: 'en'
    },
    headers: {
      Accept: 'application/json'
    },
    json: true
  };
  return rp(opts).then(results => {
    if (!results.records) {
      return [];
    }
    return results.records.map(record => ({
      language: record.languages && record.languages.length ? record.languages[0] : null,
      author: (record.nonPresenterAuthors &&
        record.nonPresenterAuthors.find(author =>
          (author.role && author.role.startsWith('kirjoittaja') || !author.role)) ||
        { name: null }).name,
      title: record.title
    }));
  }).catch((error) => {
    console.log(`Failed retrieval from Finna: ${error}`);
    return [];
  });
}

function findOpenLibrary(isbn) {
  const opts = {
    uri: 'https://openlibrary.org/api/books',
    qs: {
      bibkeys: `ISBN:${isbn}`,
      format: 'json',
      jscmd: 'details'
    },
    headers: {
      Accept: 'application/json'
    },
    json: true
  };
  return rp(opts).then(results => {
    if (!Object.values(results).length) {
      return [];
    }
    return Object.values(results).map(record => record.details).map(record => ({
      language: record.languages && record.languages.length ? record.languages[0].key.substr(11) : null,
      author: record.authors && record.authors.length ? record.authors[0].name : null,
      title: record.title
    }));
  }).catch((error) => {
    console.log(`Failed retrieval from Open Library: ${error}`);
    return [];
  });
}
