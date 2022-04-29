const Sauce = require('../models/sauce');

exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            switch (req.body.like) {
                case 1: // On like la sauce
                    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like == 1) {
                      Sauce.updateOne({ _id: req.params.id },
                        {
                          $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
                        })
                            .then(() => {res.status(201).json({ message: "Sauce likée !" });})
                            .catch((error) => {res.status(400).json({ error: error });});
                    }
                    break;
                case -1: // On dislike d'une sauce
                    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like == -1) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                            $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, 
                        })
                            .then(() => {res.status(201).json({ message: "Sauce dislikée !" });})
                            .catch((error) => {res.status(400).json({ error: error });});
                    }
                    break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                        { 
                            $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId },
                        })
                            .then(() => {res.status(201).json({ message: "Retrait du like !" });})
                            .catch((error) => {res.status(400).json({ error: error });});
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, 
                        })
                            .then(() => {res.status(201).json({ message: "Retrait du dislike !" });})
                            .catch((error) => {res.status(400).json({ error: error });});
                    }
                    break;
            }
        })
        .catch((error) => {res.status(404).json({ error: error });});
};