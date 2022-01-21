const Joi = require('joi');

const experienceNewSchema = Joi.object().keys({
    idCategory: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error(
                        'El ID de la Categoría no puede quedar vacía'
                    );
                default:
                    return new Error('idCategory es obligatoria');
            }
        }),
    title: Joi.string()
        .required()
        .min(3)
        .max(150)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('El título no puede quedar vacía');
                case 'string.min':
                    return new Error(
                        'El título no puede tener menos de 3 caracteres'
                    );
                case 'string.max':
                    return new Error(
                        'El título no puede tener más de 150 caracteres'
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
                        'La Descripción no puede tener más de 255 caracteres'
                    );
                default:
                    return new Error(
                        'La Descripción no puede tener más de 255 caracteres'
                    );
            }
        }),
    price: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('El Precio no puede quedar vacío');
                default:
                    return new Error('Precio es obligatorio');
            }
        }),
    location: Joi.string()
        .required()
        .max(100)
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('La Localización no puede quedar vacía');
                case 'string.max':
                    return new Error(
                        'La Localización no puede tener más de 100 caracteres'
                    );
                default:
                    return new Error('Localización es obligatoria');
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
    startDate: Joi.date()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Fecha Inicio no puede quedar vacía');
                default:
                    return new Error('Fecha Inicio es obligatoria');
            }
        }),
    endDate: Joi.date()
        .required()
        .greater('now')
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('El título no puede quedar vacía');
                default:
                    return new Error(
                        'Fecha Fin debe ser mayor que la fecha actual (hoy)'
                    );
            }
        }),
    totalPlaces: Joi.number()
        .required()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error(
                        'El número de plazas no puede quedar vacío'
                    );
                default:
                    return new Error(
                        'Nº de Plazas disponibles por día es obligatorio'
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
});

module.exports = { experienceNewSchema };
