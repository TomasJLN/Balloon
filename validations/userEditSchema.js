const Joi = require('joi');

const userEditSchema = Joi.object()
    .keys({
        name: Joi.string()
            .min(3)
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.min':
                        return new Error(
                            'El Nombre no puede tener menos de 3 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'El Nombre no puede tener más de 150 caracteres'
                        );
                    default:
                        return new Error(
                            'El Nombre debe tener entre 3 y 150 caracteres'
                        );
                }
            }),

        surname: Joi.string()
            .min(3)
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.min':
                        return new Error(
                            'Los Apellidos no puede tener menos de 3 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'Los Apellidos no puede tener más de 150 caracteres'
                        );
                    default:
                        return new Error('Apellidos son obligatorio');
                }
            }),

        password: Joi.string()
            .min(4)
            .max(50)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.min':
                        return new Error(
                            'Contraseña no puede tener menos de 4 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'Contraseña no puede tener más de 50 caracteres'
                        );
                    default:
                        return new Error(
                            'Contraseña debe tener entre 4 y 50 caracteres'
                        );
                }
            }),
    })
    .unknown();

module.exports = { userEditSchema };
