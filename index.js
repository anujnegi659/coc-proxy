const express = require('express');
const proxy = require('express-http-proxy');
const https = require('https');
const app = express();

app.get('/my-ip', (req, res) => {
  https.get('https://api.ipify.org?format=json', (externalRes) => {
    let data = '';
    externalRes.on('data', (chunk) => { data += chunk; });
    externalRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.send(`Render Outbound IP: ${parsed.ip}`);
      } catch (e) {
        res.status(500).send('Parsing error');
      }
    });
  }).on('error', (err) => {
    res.status(500).send('Error fetching IP: ' + err.message);
  });
});

app.use('/v1', proxy('https://api.clashofclans.com', {
  proxyReqPathResolver: function (req) {
    return '/v1' + req.url;
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
