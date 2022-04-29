const bcrypt = require('bcrypt'); // Pluggin pour hasher les mdp
const jwt = require('jsonwebtoken'); // Pluggin pour générer un Token
const Joi = require("joi"); // Pluggin permettant l'utilisation de Regex

const User = require('../models/user');

const schema = Joi.object({ // On crée un schéma de regex
    email: Joi.string().regex(/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_&é"'(èçà)=])([-+!*$@%_&é"'(èçà)=\w]{8,30})$/),
  });

exports.signup = (req, res, next) => {
    schema.validateAsync({ // Verification versus schéma Regex
        email: req.body.email,
        password: req.body.password,
    })
    .then(() => {
        bcrypt.hash(req.body.password, 10) // Récupération mdp à hasher avec bcrypt
        .then(hash => {
            const user = new User({
            email: req.body.email,
            password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                  return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};