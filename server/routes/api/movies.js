const Movies = require('../../models/Movies');
const Genres = require('../../models/Genres');

const fs = require("fs");
const stats = fs.statSync("myfile.jpg")
const fileSizeInBytes = stats["size"];
const fileSizeInMegabytes = fileSizeInBytes / 1000000.0

module.exports = (app) => {

    app.post('/api/addmovie', (req, res, next) => {
        const { body } = req;
        const {
            name,
            year,
            price,
            img
        } = body;

        let {
            genre
        } = body;

        if (!name || name.length < 1 || name.length > 4) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }
        if (!year || year.length !== 4) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }
        if (!price) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }
        if (!img || fileSizeInMegabytes > 2) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }
        if (!genre) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }

        genres = Genres.findById({
            '_id': ObjectId(Genres.find(
                {
                    id: Genres._id
                }))
        });

        Movies.find({
            name
        }, (err, previousMovie) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            } else if (previousMovie.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Movie already exist.'
                });
            }
            const newMovie = new Movies();

            newMovie.name = name;
            newMovie.save((err, movie) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error.'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Movie added.'
                });
            });
        });
    });

    app.get('/api/movies', (req, res, next) => {
        User.find().exec((err, movies) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Can not get movies'
                });
            }

            for (let i = 0; i < movies.length; i++) {
                res.write(JSON.stringify({
                    name: movies[i].name,
                    year: movies[i].year,
                    price: movies[i].price,
                    genre: movies[i].genre,
                    img: movies[i].img,
                    id: movies[i]._id
                }) + '\r\n');
            }
            res.end(JSON.stringify({
                success: true,
                message: 'Data sended'
            }));
        });
    });

    app.get('/api/getmovie', (req, res, next) => {
        Movies.findById(
            req.query.id, (err, movie) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Can not get movie by id'
                    });
                }

                return res.send({
                    name: movies.name,
                    year: movies.year,
                    price: movies.price,
                    genre: movies.genre,
                    img: movies.img,
                    id: movies._id
                });
            });
    });

    app.delete('/api/deletemovie/:id', (req, res, next) => {
        Movies.findByIdAndDelete(
            req.query.id, (err, movie) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Can not delete movie'
                    });
                }
                return res.send({
                    success: true,
                    message: "Movie deleted"
                });
            });
    });
};