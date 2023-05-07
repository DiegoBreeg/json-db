"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const Model_1 = require("./Model");
const Schema = {
    skill: { type: String, unique: false },
    volume: { type: Number, unique: false }
};
const Books = new Model_1.Model('Books', Schema);
exports.Books = Books;
