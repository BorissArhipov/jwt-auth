require('dotenv').config();

const express = require('express');
const cors = require('cors')
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.pass, 10)
        const user = { name: req.body.name, pass: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {

    const user = users.find(user => user.name == req.body.name);
    if (user == null) {
        return res.status(400).json("Cannot find user")
    }
    try {
        if(await bcrypt.compare(req.body.pass, user.pass)) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken});
        } else {
            res.json("Not Allowed")
        }
    } catch {
        res.status(500).send()
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(req);
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.serndStatus(403);
        req.user = user;
        next();
    })
}

const posts = [
    {
        username: 'person1',
        post: 'post1'
    },
    {
        username: 'person2',
        post: 'post2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(3000);
