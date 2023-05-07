"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectValidator = void 0;
const GetRules_1 = require("./GetRules");
class ObjectValidator {
    validate(dummy, rule) {
        const getRules = new GetRules_1.GetRules();
        const result = getRules.execute(dummy, rule);
        const ruleList = result[0];
        const dummyList = result[1];
        if (JSON.stringify(ruleList) === JSON.stringify(dummyList))
            return true;
        return false;
    }
}
exports.ObjectValidator = ObjectValidator;
//# sourceMappingURL=index.js.map