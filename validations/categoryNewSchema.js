const Joi = require('joi');

const categoryNewSchema = Joi.object()
    .keys({
        title: Joi.string()
            .required()
            .max(50)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'any.required':
                        return new Error('El título no puede quedar vacío');
                    case 'string.max':
                        return new Error(
                            'El título no puede tener más de 50 caracteres'
                        );
                    default:
                        return new Error('Título es obligatorio');
                }
            }),
        description: Joi.string()
            .max(255)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'La Descripción debe tener entre 3 y 255 caracteres'
                        );
                    default:
                        return new Error('La Descripción no puede queda vacía');
                }
            }),
        photo: Joi.string()
            .max(50)
            .error((errors) => {
                switch (errors[0].code) {
                    case 'string.max':
                        return new Error(
                            'El nombre de la Foto no puede tener más de 50 caracteres'
                        );
                    default:
                        return new Error(
                            'El nombre de la Foto no puede tener más de 50 caracteres'
                        );
                }
            }),
    })
    .unknown();

module.exports = { categoryNewSchema };
