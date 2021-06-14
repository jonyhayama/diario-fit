JWTSessions.encryption_key = ENV.fetch("JWT_ENC_KEY", 'secret')
# time in seconds between refreshing token / reauth
JWTSessions.access_exp_time = 1 * 60 * 60 # 1 hours
# maximum session duration
JWTSessions.refresh_exp_time = 48 * 60 * 60 # 48 hours

JWTSessions.token_store = :redis, { redis_url: ENV.fetch("REDISCLOUD_URL", nil) }
