import * as express from 'express'

const app = express()

app.use('/api/v1/', require('./routers/router'))
app.listen(8080)

