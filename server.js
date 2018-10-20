var express = require('express');

const app = express();

app.use('/', express.static(__dirname + '/brh'));

app.listen(8000, () => {
  console.log('Server is listening');
});

//routes
app.get('/', function (req, res) {
    res.sendFile('index.html');
});