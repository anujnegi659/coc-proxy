const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

// Ye endpoint aapko Render ka exact Fixed IP bata dega
app.get('/my-ip', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    res.send(`Render Outbound IP: ${data.ip}`);
  } catch (err) {
    res.status(500).send('Error fetching IP');
  }
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
