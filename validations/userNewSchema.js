const Joi = require('joi');

const userNewSchema = Joi.object()
    .keys({
        name: Joi.string()
            .required()
            .min(3)
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'any.required':
                        return new Error('El Nombre no puede quedar vacío');
                    case 'string.min':
                        return new Error(
                            'El Nombre no puede tener menos de 3 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'El Nombre no puede tener más de 150 caracteres'
                        );
                    default:
                        return new Error('Nombre es obligatorio');
                }
            }),

        surname: Joi.string()
            .required()
            .min(3)
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'any.required':
                        return new Error('Los Apellidos no puede quedar vacío');
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

        password: Joi.string()
            .required()
            .min(4)
            .max(50)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'any.required':
                        return new Error('Contraseña no puede quedar vacía');
                    case 'string.min':
                        return new Error(
                            'Contraseña no puede tener menos de 4 caracteres'
                        );
                    case 'string.max':
                        return new Error(
                            'Contraseña no puede tener más de 50 caracteres'
                        );
                    default:
                        return new Error('Contraseña es obligatoria');
                }
            }),

        passwordRepeat: Joi.ref('password'),

        avatar: Joi.string()
            .max(50)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'El nombre de avatar no puede tener más de 50 caracteres'
                        );
                    default:
                        return new Error(
                            'El nombre de avatar no puede tener más de 50 caracteres'
                        );
                }
            }),

        recoveryCode: Joi.string()
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'Codigo de Recuperación no puede superar los 150 caracteres'
                        );
                    default:
                        return new Error(
                            'Codigo de Recuperación no puede superar los 150 caracteres'
                        );
                }
            }),

        registryCode: Joi.string()
            .max(150)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'Codigo de Registro no puede superar los 150 caracteres'
                        );
                    default:
                        return new Error(
                            'Codigo de Registro no puede superar los 150 caracteres'
                        );
                }
            }),
    })
    .unknown();

module.exports = { userNewSchema };
