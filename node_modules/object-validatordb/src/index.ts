import { GetRules } from './GetRules'


class ObjectValidator {
    validate(dummy: object, rule: object): boolean {

        const getRules = new GetRules()
        const result = getRules.execute(dummy, rule)
        const ruleList = result[0]
        const dummyList = result[1]        

        if (JSON.stringify(ruleList) === JSON.stringify(dummyList))
            return true
        return false
    }
}

//exports.ObjectValidator = ObjectValidator
export { ObjectValidator }
