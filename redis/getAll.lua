local keys = redis.call('KEYS', 'isbn:*')
return redis.call('MGET', unpack(keys))