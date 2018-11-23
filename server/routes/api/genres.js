const Genres = require('../../models/Genres');

module.exports = (app) => {

    app.post('/api/addgenre', (req, res, next) => {
        const { body } = req;
        const {
            name
        } = body;

        if (!name) {
            return res.send({
                success: false,
                message: 'Error: Genre name cannot be blank.'
            });
        }

        Genres.find({
            name
        }, (err, previousGenre) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            } else if (previousGenre.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Genre already exist.'
                });
            }
            const newGenre = new Genres();

            newGenre.name = name;
            newGenre.save((err, genre) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error.'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Genre created.'
                });
            });
        });
    });

    app.get('/api/genres', (req, res, next) => {
        Genres.find().exec((err, genres) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Can not get genres'
                });
            }

            for (let i = 0; i < genres.length; i++) {
                res.write(JSON.stringify({
                    name: genres[i].name,
                    id: genres[i]._id
                }) + '\r\n');
            }
            res.end(JSON.stringify({
                success: true,
                message: 'Data sended'
            }));
        });
    });

    app.get('/api/getgenre', (req, res, next) => {
        Genres.findById(
            req.query.id, (err, genre) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Can not get genre by id'
                    });
                }

                return res.send({
                    name: genre.name,
                    id: genre._id
                });
            });
    });

    app.delete('/api/deletegenre/:id', (req, res, next) => {
        Genres.findByIdAndDelete(
            req.query.id, (err, genre) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Can not delete genre'
                    });
                }
                return res.send({
                    success: true,
                    message: "Genre deleted"
                });
            });
    });
};