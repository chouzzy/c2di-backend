"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investorProfileRoutes = void 0;
const express_1 = require("express");
const CreateInvestorProfileController_1 = require("../modules/registrations/useCases/InvestorProfile/createInvestorProfile/CreateInvestorProfileController");
const investorProfileRoutes = (0, express_1.Router)();
exports.investorProfileRoutes = investorProfileRoutes;
const createInvestorProfileController = new CreateInvestorProfileController_1.CreateInvestorProfileController();
investorProfileRoutes.post('/create', createInvestorProfileController.handle);
