const Joi = require('joi');

const reviewNewSchema = Joi.object().keys({
    idBookingExperience: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error(
                        'El ID del Booking de la Experiencia no puede quedar vacío'
                    );
                default:
                    return new Error(
                        'idBookingExperience es obligatoria y debe ser numérico'
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
    score: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La Puntuación no puede quedar vacío');
                default:
                    return new Error('Puntuación es obligatoria');
            }
        }),
    voted: Joi.boolean()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('El Estado de Votado no puede ser nulo');
                default:
                    return new Error('Voto realizado es obligatorio');
            }
        }),
});

module.exports = { reviewNewSchema };
