const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/greet', (req, res) => {
    const hours = new Date().getHours();
    let greeting;

    if (hours < 12) {
        greeting = 'Good Morning!';
    } else if (hours < 18) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }

    res.json({ message: greeting });
});

app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});

