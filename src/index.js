const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

const app = express();

// Middleware
// Validation
app.use(expressValidator());
// Encoding of parameters in body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

// Connection to database
const databaseURL = 'mongodb+srv://motionMovie:motionMovie3APP@posterdb.tbqjgbg.mongodb.net/posterDB'
mongoose.connect(databaseURL);

// Schema for posters
const posterSchema = {
    id: Number,
    trailerURL: String,
    review: String,
}

// Class ofzo
const PosterData = mongoose.model('PosterData', posterSchema);

// Start app
const port = 3000;
app.listen(port, function(){
    console.log('Server started on port:', port);
});

// Get all posters
const getPosters = (req, res) => {
    PosterData.find((err, foundMovies) => {
        if(!err) res.send(foundMovies);
        if(err) res.send(err);
    });
}

// Get one poster
const getPoster = (req, res) => {
    PosterData.findOne(
        { id: req.params.id},
        function(err, foundPoster){
            if(foundPoster) res.send(foundPoster)
            if(!foundPoster) res.send("No poster matching that id was found.");
        }
    )
}

// Create one poster
const createPoster = (req, res) => {
    console.log(req.params)
    
    const newPoster = new PosterData(
        {
            id: req.body.id,
            trailerURL: req.body.trailerURL,
            review: req.body.review,
        }
    );

    // Saving poster
    newPoster.save((err) => {
        if(!err) res.send('Successfully added a new poster!');
        if(err) res.send(err);
    })
}

// Validations
// Post poster
const createPostValidator = (req, res, next) => {
    req.check('id', 'Give id').notEmpty();

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
    PosterData.updateOne(
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
    PosterData.deleteMany((err) => {
        if(!err) res.send("Successfully deleted all movies!");
        if(err) res.send(err);
    })
}

// Delete one poster
const deletePoster = (req, res) => {
    PosterData.deleteOne({ id: req.params.id });
}

// Routes
app.get("/posters", getPosters);
app.get("/poster/:id", getPoster);
app.patch("/poster/:id", patchPoster);
app.post("/poster/create", createPoster);
app.delete("/posters/delete", deletePosters);app.delete("/poster/delete/:id", deletePoster);