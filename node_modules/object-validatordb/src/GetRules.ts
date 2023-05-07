export class GetRules {
    public ruleList: Array<object> = []
    public dummyList: Array<object> = []
    public dummySubList: Array<object> = []

    execute(dummy: any, rule: any): Array<any> {

        for (let prop in rule) {
            if (typeof rule[prop] == 'object' && !Array.isArray(rule[prop]))
                this.ruleList.push({ key: prop, value: 'object' })
            if (typeof rule[prop] == 'object' && Array.isArray(rule[prop]))
                this.ruleList.push(({ key: prop, value: 'array' }))
            if (rule[prop] == String || typeof rule[prop] == 'string')
                this.ruleList.push(({ key: prop, value: 'string' }))
            if (rule[prop] == Number || typeof rule[prop] == 'number')
                this.ruleList.push(({ key: prop, value: 'number' }))
        }

        for (let prop in dummy) {
            if (typeof dummy[prop] == 'object' && !Array.isArray(dummy[prop]))
                this.dummyList.push({ key: prop, value: 'object' })
            if (typeof dummy[prop] == 'object' && Array.isArray(dummy[prop]))
                this.dummyList.push(({ key: prop, value: 'array' }))
            if (typeof dummy[prop] == 'string')
                this.dummyList.push(({ key: prop, value: 'string' }))
            if (typeof dummy[prop] == 'number')
                this.dummyList.push(({ key: prop, value: 'number' }))
        }

        return [this.ruleList, this.dummyList]
    }

}