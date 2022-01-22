const Joi = require('joi');

const experienceEditSchema = Joi.object()
    .keys({
        idCategory: Joi.number(),
        title: Joi.string()
            .min(3)
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.min':
                        return new Error(
                            'El título no puede tener menos de 3 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'El título no puede tener más de 150 caracteres'
                        );
                    default:
                        return new Error(
                            'El título no puede tener más de 150 caracteres'
                        );
                }
            }),
        description: Joi.string()
            .max(255)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'La Descripción no puede tener más de 255 caracteres'
                        );
                    default:
                        return new Error(
                            'La Descripción no puede tener más de 255 caracteres'
                        );
                }
            }),
        location: Joi.string()
            .max(100)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'La Localización no puede tener más de 100 caracteres'
                        );
                    default:
                        return new Error(
                            'La Localización no puede tener más de 100 caracteres'
                        );
                }
            }),
        coords: Joi.string()
            .max(100)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'Las Coordenadas no puede tener más de 100 caracteres'
                        );
                    default:
                        return new Error(
                            'Las Coordenadas no pueden sobrepasar los 100 caracteres'
                        );
                }
            }),
        endDate: Joi.date()
            .greater('now')
            .error((errors) => {
                switch (errors[0].code) {
                    default:
                        return new Error(
                            'Fecha Fin debe ser mayor que la fecha actual (hoy)'
                        );
                }
            }),
        conditions: Joi.string()
            .max(255)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'Condiciones no puede tener más de 255 caracteres'
                        );
                    default:
                        return new Error(
                            'Condiciones no puede tener más de 255 caracteres'
                        );
                }
            }),
        normatives: Joi.string()
            .max(255)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'Normativa no puede tener más de 255 caracteres'
                        );
                    default:
                        return new Error(
                            'Normativa no puede tener más de 255 caracteres'
                        );
                }
            }),
    })
    .unknown();

module.exports = { experienceEditSchema };
