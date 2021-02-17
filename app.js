const express = require('express');
const morgan = require('morgan');

const app = express();

// app.use(morgan('dev'));

app.get('/about',morgan('dev'), (req, res)=>{
    // res.send(`<h1>I am about page</h1>`)
    res.json({
        message: 'I am a response from yout route handler'
    })
})

app.get('/help', (req, res)=>{
    res.send(`<h1>I am help page</h1>`)
})


app.get('/', (req, res)=>{
    res.send(` <h1>I am listening</h1>`)
})

app.get('*', (req, res)=>{
    res.send(` <h1>404 Not Found</h1>`)
})


const PORT = process.env.PORT || 8080;
app.listen( PORT, ()=>{
    console.log(`Server is Running on PORT ${PORT}`);
})