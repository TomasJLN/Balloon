const Joi = require('joi');

const newsletterSchema = Joi.object()
    .keys({
        email: Joi.string()
            .email()
            .required()
            .max(100)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'any.required':
                        return new Error('Email no puede quedar vacío');
                    case 'string.max':
                        return new Error(
                            'Email no puede contener más de 100 caracteres'
                        );
                    default:
                        return new Error(
                            'Email no puede quedar vacío y debe ser un email válido'
                        );
                }
            }),
    })
    .unknown();

module.exports = { newsletterSchema };
