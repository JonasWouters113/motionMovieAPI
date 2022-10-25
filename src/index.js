const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

const app = express();

// Middleware
// Validation
app.use(expressValidator());
// Encoding of parameters in body
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connection to database
const databaseURL = 'mongodb+srv://motionMovie:motionMovie3APP@posterdb.tbqjgbg.mongodb.net/PosterDB'
mongoose.connect(databaseURL);

var { Poster } = require('../models/poster');

// Start app
const port = 3000;
app.listen(port, function(){
    console.log('Server started on port:', port);
});

// Get all posters
const getPosters = (req, res) => {
    Poster.find((err, foundMovies) => {
        if(!err) res.send(foundMovies);
        if(err) res.send(err);
    });
}

// Get one poster
const getPoster = (req, res) => {
    Poster.findOne(
        { id: req.params.id},
        function(err, foundPoster){
            if(foundPoster) res.send(foundPoster)
            if(!foundPoster) res.send("No poster matching that id was found.");
        }
    )
}

// Create one poster
const createPoster = (req, res) => {
    console.log("body:", req.body);
    const newPoster = new Poster(req.body);
    console.log("newPoster:", newPoster);

    // Saving poster
//    newPoster.save()
//    .then(item => res.send('Item saved to database'))
//    .catch(err => res.status(400).send('unable to save to database'))

    newPoster.save((err) => {
        if(!err){
            res.send('Successfully added a new poster!');
        }
        if(err){
            console.log(err);
            res.send(err);
        } 
    })
}

// Validations
// Post poster
const createPostValidator = (req, res, next) => {
    req.check('id', 'Give id').notEmpty();
    req.check('trailerURL', 'Give trailerURL').notEmpty();
    req.check('review', 'Give review').notEmpty();

    // Check for errors
    const errors = req.validationErrors();
    // If error show the first one as thay happen
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    // Proceed to next middleware
    next();
}

// Update poster
const patchPoster = (req, res) => {
    Poster.updateOne(
        { id: req.params.id },
        { $set: req.body },
        (err) => {
            if(!err) res.send('Successfully updated!');
            if(err) res.send(err);
        }
    );
}

// Delete all posters
const deletePosters = (req, res) => {
    Poster.deleteMany((err) => {
        if(!err) res.send("Successfully deleted all movies!");
        if(err) res.send(err);
    })
}

// Delete one poster
const deletePoster = (req, res) => {
    Poster.deleteOne({ id: req.params.id });
}

// Routes
app.get("/posters", getPosters);
app.get("/poster/:id", getPoster);
app.patch("/poster/:id", patchPoster);
app.post("/poster/create",createPostValidator, createPoster);
app.delete("/posters/delete", deletePosters);
app.delete("/poster/delete/:id", deletePoster);