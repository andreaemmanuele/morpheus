import bcryptjs from 'bcryptjs';
import { executeQuery } from '../utils/db.js';
import { queries } from '../queries/index.js';
export const findUserByEmail = async (email) => {
    const result = await executeQuery(queries.auth.findUserByEmail, [email]);
    return result.rows[0];
};
export const findUserById = async (id) => {
    const result = await executeQuery(queries.auth.findUserById, [id]);
    return result.rows[0];
};
export const findUserBySuspendedToken = async (token) => {
    const result = await executeQuery(queries.auth.findUserBySuspendedToken, [token]);
    return result.rows[0];
};
export const updateUserStatus = async (status, userId) => await executeQuery(queries.auth.updateStatus, [status, userId]);
export const updateSuspendedToken = async (token, userId) => await executeQuery(queries.auth.updateSuspendedToken, [token, userId]);
export const updateLastLogin = async (userId) => await executeQuery(queries.auth.updateLastLogin, [userId]);
export const incrementLoginAttempts = async (userId) => {
    const result = await executeQuery(queries.auth.incrementLoginAttempts, [userId]);
    return result.rows[0];
};
export const resetLoginAttempts = async (userId) => await executeQuery(queries.auth.resetLoginAttempts, [userId]);
export const validatePassword = async (plainPassword, hashedPassword) => await bcryptjs.compare(plainPassword, hashedPassword);
export const generatePasswordHash = async (password) => await bcryptjs.hash(password, 10);
