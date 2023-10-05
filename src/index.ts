import path from 'path'
import fs from 'fs'
import { ObjectValidator } from "object-validatordb"

const filename = require.main?.filename || __dirname
const appDir = path.dirname(filename)

const validator = new ObjectValidator()

type SchemaConfig = {
    type: String | Number | [] | {},
    unique: false | true
}

type Schema = { [key: string]: SchemaConfig }

class Model<T>{
    public dataPath
    public modelName
    public schema: Schema

    constructor(modelName: string, schema: Schema) {
        this.modelName = modelName
        this.dataPath = path.resolve(appDir, './data', `${this.modelName}.json`)
        this.schema = schema

        if (!fs.existsSync(path.resolve(appDir, './data'))) {
            fs.mkdirSync(path.resolve(appDir, './data'))
        }

        if (!fs.existsSync(this.dataPath))
            fs.writeFileSync(this.dataPath, JSON.stringify([]))
    }

    private isDataTypeValid(data: any): Boolean {
        const response: Boolean[] = []

        for (const [key, value] of Object.entries(data as object)) {
            const isTypeValid = validator.validate({ type: data[key] }, { type: this.schema[key].type })
            response.push(isTypeValid)
        }
        return response.every((element: Boolean) => element === true)
    }

    private getUniqueFields(data: any): String[] {
        const uniqueFields: String[] = []

        for (const [key, value] of Object.entries(data)) {
            this.schema[key].unique ? uniqueFields.push(key) : null
        }

        return uniqueFields
    }

    private isDataKeysValid(data: any): Boolean {
        return JSON.stringify(Object.keys(this.schema)) === JSON.stringify(Object.keys(data))
    }

    private findData(dataList: T[], filter: { [key: string]: any }): any {
        return dataList.find((ell: any) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] !== value)
                    return false
            }
            return true
        })
    }

    private replaceData(dataList: T[], foundData: any, filter: { [key: string]: any }) {
        dataList.forEach((ell: any, index) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] !== value)
                    return
            }
            dataList[index] = foundData
        })
    }

    private updateData(foundData: any, newData: { [key: string]: any }) {
        for (const [key, value] of Object.entries(newData)) {
            if (!foundData[key])
                throw new Error(`The key ${key} do not exist on filtered object`)
            if (typeof foundData[key] !== typeof value)
                throw new Error(`The type of data found is different from the type provided`)
            foundData[key] = value
        }
    }

    public Find(filter: object): T | {} {
        const storedData = fs.readFileSync(this.dataPath, 'utf8')
        const dataList: T[] = JSON.parse(storedData)

        const foundData = this.findData(dataList, filter)

        return foundData || {}
    }

    public FindAll(): T[] {
        const storedData = fs.readFileSync(this.dataPath, 'utf8')
        const dataList: T[] = JSON.parse(storedData)

        return dataList
    }

    public Save(dataToSave: T): T {
        if (!this.isDataKeysValid(dataToSave))
            throw new Error(`Data Kyes is different from the schema Keys`)

        if (!this.isDataTypeValid(dataToSave))
            throw new Error(`Data type is different from the schema type`)

        const dataToSaveDicionary: { [key: string]: any } = {}

        for (const [key, value] of Object.entries(dataToSave as object)) {
            dataToSaveDicionary[key] = value
        }

        const storedData = fs.readFileSync(this.dataPath, 'utf8')
        const dataList: T[] = JSON.parse(storedData)
        const uniqueFields: String[] = this.getUniqueFields(dataToSave)
        dataList.forEach((dataItem: any) => {
            uniqueFields.forEach((uniqueField: any) => {
                if (dataItem[String(uniqueField)] === dataToSaveDicionary[String(uniqueField)])
                    throw new Error(`Field ${uniqueField} is unique and already registered`)
            })
        })
        dataList.push(dataToSave)
        const data = JSON.stringify(dataList)
        fs.writeFileSync(this.dataPath, data)
        return dataToSave
    }

    public Delete(filter: { [key: string]: any }): T | {} {
        const storedData = fs.readFileSync(this.dataPath, 'utf8')
        const dataList: T[] = JSON.parse(storedData)
        const filteredDataList: T[] = []
        dataList.forEach((ell: any) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] == value)
                    return
            }
            return filteredDataList.push(ell)
        })
        const dataToStore = JSON.stringify(filteredDataList)
        fs.writeFileSync(this.dataPath, dataToStore)
        return {}
    }

    public FindAndUpdate(filter: { [key: string]: any }, data: { [key: string]: any }) {
        const storedData = fs.readFileSync(this.dataPath, 'utf8')
        const dataList: T[] = JSON.parse(storedData)

        const foundData = this.findData(dataList, filter)

        if (!foundData)
            throw new Error(`Filter data not found`)

        this.updateData(foundData, data)

        this.replaceData(dataList, foundData, filter)

        fs.writeFileSync(this.dataPath, JSON.stringify(dataList))

        return foundData
    }
}

export { Model, SchemaConfig, Schema }