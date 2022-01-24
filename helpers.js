/** Requirements **/
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const sharp = require('sharp');
const { ensureDir, unlink } = require('fs-extra');
const path = require('path');
const uuid = require('uuid');
const registryMail = require('./templates/registryMail');

const { SENDGRID_API_KEY, SENDGRID_FROM, PUBLIC_HOST, UPLOADS_DIRECTORY } =
    process.env;

const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

sgMail.setApiKey(SENDGRID_API_KEY);

/** getRandomString **/
function getRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}

/** sendMail **/
async function sendMail({ to, subject, body }) {
    try {
        const msg = {
            to,
            from: SENDGRID_FROM,
            subject,
            text: body,
            html: `<div><h1>${subject}</h1><p>${body}</p></div>`,
        };
        await sgMail.send(msg);
    } catch (_) {
        throw new Error('TError al enviar el mensaje...');
    }
}

/** checkEmail **/
async function checkEmail(email, registryCode) {
    const emailText = registryMail(registryCode);

    await sendMail({
        to: email,
        subject: 'Activa tu cuenta de usuario en Balloon Experiences 🎈',
        body: emailText,
    });
}

/** savePhoto **/
async function savePhoto(image, type) {
    try {
        await ensureDir(uploadsDir);
        const sharpImage = sharp(image.data);
        const imageInfo = await sharpImage.metadata();
        //maxWidth -> type = 0 avatar and type = 1 to photo

        if (type === 0) sharpImage.resize(200, 200);
        else if (type === 1 && imageInfo > 800) sharpImage.resize(800);

        const imageName = `${uuid.v4()}.jpg`;
        const imagePath = path.join(uploadsDir, imageName);
        await sharpImage.toFile(imagePath);
        return imageName;
    } catch (_) {
        throw new Error('Error procesando la imagen');
    }
}

/** deletePhoto **/
async function deletePhoto(photoName) {
    console.log(path.join(uploadsDir, photoName));
    try {
        const photoPath = path.join(uploadsDir, photoName);
        await unlink(photoPath);
    } catch (_) {
        throw new Error('Error al eliminar la imagen del servidor');
    }
}

/** Fields Validator - Joi **/
async function checkField(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}

async function validate(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}

module.exports = {
    getRandomString,
    sendMail,
    checkEmail,
    savePhoto,
    deletePhoto,
    checkField,
    validate,
};
