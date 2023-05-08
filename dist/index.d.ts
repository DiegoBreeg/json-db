type SchemaConfig = {
    type: String | Number | [] | {};
    unique: false | true;
};
type Schema = {
    [key: string]: SchemaConfig;
};
declare class Model<T> {
    private dataPath;
    private modelName;
    private schema;
    constructor(modelName: string, schema: Schema);
    private isDataTypeValid;
    private getUniqueFields;
    private isDataKeysValid;
    Find(filter: object): T | {};
    FindAll(): T[];
    Save(dataToSave: T): T;
    Delete(filter: object): T | {};
    FindAndUpdate(filter: {
        [key: string]: any;
    }, data: {
        [key: string]: any;
    }): any;
}
export { Model, SchemaConfig, Schema };
