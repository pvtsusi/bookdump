local sha = KEYS[1]

local reservation_isbns = redis.call('SMEMBERS', 'reservations:' .. sha)
local reservation_keys = {}
for i = 1, #reservation_isbns do
    reservation_keys[i] = 'isbn:' .. reservation_isbns[i]
end
local freed = {}
if #reservation_keys > 0 then
    local books = redis.call('MGET', unpack(reservation_keys))
    for i = 1, #books do
        local book = cjson.decode(books[i])
        if sha == book['reserver'] then
            book['reserver'] = nil
            local book_json = cjson.encode(book)
            redis.call('SET', 'isbn:' .. book['isbn'], book_json)
            freed[#freed + 1] = book_json
        end
    end
end

redis.call('DEL', 'user:' .. sha)
redis.call('DEL', 'reservations:' .. sha)

return freed
