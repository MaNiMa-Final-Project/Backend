import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) with the given payload and duration
 *
 * @param {Object} payload The data to be included in the JWT
 * @param {string} duration The duration for which the JWT will be valid
 * @returns {string} The generated JWT
 */
export function generateJsonWebToken(payload, duration) {
    const options = { expiresIn: `${duration}` };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}
