"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BooksModel_1 = require("./database/models/BooksModel");
function Start() {
    BooksModel_1.Books.Save({ skill: 'medicina', volume: 1 });
    console.log(BooksModel_1.Books.FindAll());
}
Start();
