"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRepository = void 0;
const notificationsUtils_1 = require("../../../../utils/notificationsUtils");
class NotificationsRepository {
    createNotifications(notificationsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield (0, notificationsUtils_1.createPrismaNotifications)(notificationsData);
                return notification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listNotifications(id, page, pageRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, notificationsUtils_1.listPrismaNotifications)(id, page, pageRange);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listUserNotifications(userID, page, pageRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, notificationsUtils_1.listPrismaUserNotifications)(userID, page, pageRange);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    readNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield (0, notificationsUtils_1.readPrismaNotifications)(id);
                return notifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.NotificationsRepository = NotificationsRepository;
