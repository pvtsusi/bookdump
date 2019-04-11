local isbn = KEYS[1]
local sha = KEYS[2]
local name = KEYS[3]
local override = KEYS[4] == 'true'
local book_json = redis.call('GET', 'isbn:' .. isbn)
if not book_json then
    return redis.error_reply(isbn .. ' not found')
end
local book = cjson.decode(book_json)
if not override and (not book['reserver'] or book['reserver'] ~= sha) then
    return redis.error_reply(isbn .. ' not reserved for ' .. book['reserver'])
end

book['reserver'] = nil
book_json = cjson.encode(book)

redis.call('SET', 'user:' .. sha, name)
redis.call('SREM', 'reservations:' .. sha, isbn)
redis.call('SET', 'isbn:' .. isbn, book_json)

return redis.status_reply('Ok')
