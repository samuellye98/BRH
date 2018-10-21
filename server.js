var express = require('express');
var path = require('path');

const app = express();

app.use('/', express.static(__dirname + '/brh'));

//routes
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/brh', 'index.html'));
});

app.get('/chat', function (req, res) {
    res.redirect('http://localhost:7000');
});

app.listen(8000, () => {
  console.log('Web server running on port 8000');
});
