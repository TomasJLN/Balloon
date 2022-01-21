const Joi = require('joi');

const bookingNewSchema = Joi.object().keys({
    idExperience: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('idExperience es obligatorio');
                default:
                    return new Error('idExperience es obligatorio');
            }
        }),
    idUser: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('idUser es obligatorio');
                default:
                    return new Error('idUser es obligatorio');
            }
        }),
    ticket: Joi.string()
        .required()
        .max(20)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Ticket es obligatorio');
                case 'string.max':
                    return new Error(
                        'Ticket no puede tener más de 20 caracteres'
                    );
                default:
                    return new Error(
                        'Ticket no puede tener más de 20 caracteres'
                    );
            }
        }),
    expired: Joi.boolean().error((errors) => {
        switch (errors[0].code) {
            default:
                return new Error('Expired debe ser un booleano');
        }
    }),
});

module.exports = { bookingNewSchema };
