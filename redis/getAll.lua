local sha = KEYS[1]
local allNames = KEYS[2] == 'true'

local book_keys = redis.call('KEYS', 'isbn:*')
local books = redis.call('MGET', unpack(book_keys))
for i = 1, #books do
    local book = cjson.decode(books[i])
    if book['reserver'] and (sha == book['reserver'] or allNames) then
        local name = redis.call('GET', 'user:' .. book['reserver'])
        book['reserverName'] = name
        books[i] = cjson.encode(book)
    end
end
return books