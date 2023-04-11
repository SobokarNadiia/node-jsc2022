"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validators_1 = require("../validators");
const middlewares_1 = require("../middlewares");
const enums_1 = require("../enums");
const router = (0, express_1.Router)();
router.post("/register", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.createUser), middlewares_1.userMiddleware.getDynamicallyAndThrow("email"), controllers_1.authController.register);
router.post("/login", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.loginUser), middlewares_1.userMiddleware.getDynamicallyOrThrow("email"), controllers_1.authController.login);
router.post("/refresh", middlewares_1.authMiddleware.checkRefreshToken, controllers_1.authController.refresh);
router.post("/password/change", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.changePassword), middlewares_1.authMiddleware.checkAccessToken, controllers_1.authController.changePassword);
router.post("/password/forgot", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.emailUser), middlewares_1.userMiddleware.getDynamicallyOrThrow("email"), controllers_1.authController.forgotPassword);
router.put("/password/forgot/:token", middlewares_1.commonMiddleware.isBodyValid(validators_1.UserValidator.newPassword), middlewares_1.authMiddleware.checkActionToken(enums_1.EActionTokenType.forgot), middlewares_1.authMiddleware.checkOldPassword, controllers_1.authController.setForgotPassword);
router.post("/activate/:token", middlewares_1.authMiddleware.checkActionToken(enums_1.EActionTokenType.activate), controllers_1.authController.activate);
exports.authRouter = router;
