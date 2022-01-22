const Joi = require('joi');

const bookingNewSchema = Joi.object()
    .keys({
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
        ticket: Joi.string()
            .max(20)
            .error((errors) => {
                switch (errors[0].code) {
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
        dateExperience: Joi.date(),
        quantity: Joi.number(),
    })
    .unknown();

module.exports = { bookingNewSchema };
