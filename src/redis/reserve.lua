local isbn = KEYS[1]
local sha = KEYS[2]
local name = KEYS[3]
local book_json = redis.call('GET', 'isbn:' .. isbn)
if not book_json then
    return redis.error_reply(isbn .. ' not found')
end
local book = cjson.decode(book_json)
if book['reserver'] and book['reserver'] ~= sha then
    return redis.error_reply(isbn .. ' already reserved for ' .. book['reserver'])
end

book['reserver'] = sha
book_json = cjson.encode(book)

redis.call('SET', 'user:' .. sha, name)
redis.call('SADD', 'reservations:' .. sha, isbn)
redis.call('SET', 'isbn:' .. isbn, book_json)

return redis.status_reply('Ok')
