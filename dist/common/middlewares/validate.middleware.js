"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_js_1 = require("../errors/ApiError.js");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body || req.body;
            req.query = parsed.query || req.query;
            req.params = parsed.params || req.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorDetails = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return next(ApiError_js_1.ApiError.badRequest('Validation Failed', errorDetails));
            }
            next(error);
        }
    };
};
exports.validate = validate;
