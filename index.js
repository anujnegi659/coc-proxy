const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

app.use('/v1', proxy('https://api.clashofclans.com', {
  proxyReqPathResolver: function (req) {
    return '/v1' + req.url;
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
