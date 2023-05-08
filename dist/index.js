"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const object_validatordb_1 = require("object-validatordb");
const filename = ((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename) || __dirname;
const appDir = path_1.default.dirname(filename);
const validator = new object_validatordb_1.ObjectValidator();
class Model {
    constructor(modelName, schema) {
        this.modelName = modelName;
        this.dataPath = path_1.default.resolve(appDir, './data', `${this.modelName}.json`);
        this.schema = schema;
        if (!fs_1.default.existsSync(path_1.default.resolve(appDir, './data'))) {
            fs_1.default.mkdirSync(path_1.default.resolve(appDir, './data'));
        }
        if (!fs_1.default.existsSync(this.dataPath))
            fs_1.default.writeFileSync(this.dataPath, JSON.stringify([]));
    }
    isDataTypeValid(data) {
        const response = [];
        for (const [key, value] of Object.entries(data)) {
            const isTypeValid = validator.validate({ type: data[key] }, { type: this.schema[key].type });
            response.push(isTypeValid);
        }
        return response.every((element) => element === true);
    }
    getUniqueFields(data) {
        const uniqueFields = [];
        for (const [key, value] of Object.entries(data)) {
            this.schema[key].unique ? uniqueFields.push(key) : null;
        }
        return uniqueFields;
    }
    isDataKeysValid(data) {
        return JSON.stringify(Object.keys(this.schema)) === JSON.stringify(Object.keys(data));
    }
    Find(filter) {
        const storedData = fs_1.default.readFileSync(this.dataPath, 'utf8');
        const dataList = JSON.parse(storedData);
        const foundData = dataList.find((ell) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] !== value)
                    return false;
            }
            return true;
        });
        return foundData || {};
    }
    FindAll() {
        const storedData = fs_1.default.readFileSync(this.dataPath, 'utf8');
        const dataList = JSON.parse(storedData);
        return dataList;
    }
    Save(dataToSave) {
        if (!this.isDataKeysValid(dataToSave))
            throw new Error(`Data Kyes is different from the schema Keys`);
        if (!this.isDataTypeValid(dataToSave))
            throw new Error(`Data type is different from the schema type`);
        const dataToSaveDicionary = {};
        for (const [key, value] of Object.entries(dataToSave)) {
            dataToSaveDicionary[key] = value;
        }
        const storedData = fs_1.default.readFileSync(this.dataPath, 'utf8');
        const dataList = JSON.parse(storedData);
        const uniqueFields = this.getUniqueFields(dataToSave);
        dataList.forEach((dataItem) => {
            uniqueFields.forEach((uniqueField) => {
                if (dataItem[String(uniqueField)] === dataToSaveDicionary[String(uniqueField)])
                    throw new Error(`Field ${uniqueField} is unique and already registered`);
            });
        });
        dataList.push(dataToSave);
        const data = JSON.stringify(dataList);
        fs_1.default.writeFileSync(this.dataPath, data);
        return dataToSave;
    }
    Delete(filter) {
        const storedData = fs_1.default.readFileSync(this.dataPath, 'utf8');
        const dataList = JSON.parse(storedData);
        const filteredDataList = [];
        dataList.forEach((ell) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] == value)
                    return;
            }
            return filteredDataList.push(ell);
        });
        const dataToStore = JSON.stringify(filteredDataList);
        fs_1.default.writeFileSync(this.dataPath, dataToStore);
        return {};
    }
    FindAndUpdate(filter, data) {
        const storedData = fs_1.default.readFileSync(this.dataPath, 'utf8');
        const dataList = JSON.parse(storedData);
        const foundData = dataList.find((ell) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] !== value)
                    return false;
            }
            return true;
        });
        if (!foundData)
            throw new Error(`Filter data not found`);
        for (const [key, value] of Object.entries(data)) {
            if (!foundData[key])
                throw new Error(`The key ${key} do not exist on filtered object`);
            if (typeof foundData[key] !== typeof value)
                throw new Error(`The type of data found is different from the type provided`);
            foundData[key] = value;
        }
        dataList.forEach((ell, index) => {
            for (const [key, value] of Object.entries(filter)) {
                if (ell[key] !== value)
                    return;
            }
            dataList[index] = foundData;
        });
        fs_1.default.writeFileSync(this.dataPath, JSON.stringify(dataList));
        return foundData;
    }
}
exports.Model = Model;
