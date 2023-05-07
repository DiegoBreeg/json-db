<h3>Json-Database-db<h3>

This library allows you to easily create an local database in JSON format.
github: https://github.com/DiegoBreeg/json-db.git

<h3>Usage<h3>
Install this library:

```bash
$ npm i json-database-db
```
Import or require the library to your code
```js
const { Model } = require('json-database-db')

```
```js
import { Model } from 'json-database-db'

```
Use the Model class to instantiate an object capable of manipulating the database<br>
Model class require 2 arguments<br>
-Collection/Database name: string with Collection name.<br>
-schema: an object with key names and the types of their values.<br>
```js
ObjectValidator.validate(dummy: any, rule: any): boolean
```

```js
const { Model } = require('json-database-db')

const schema = {
    name: { type: String, unique: false },
    LastName: { type: String, unique: false }

}

const Users = new Model('Books', schema)
Users.Save({name: 'Jhoe', LastName: 'Doe'})
Users.FindAll()
```

schema also accepts Arrays and Objects.
```js
const { Model } = require('json-database-db')

const Users = new Model('Users', {
    name: { type: String },
    age: { type: Number },
    hobbie: { type: [] },
    skills: { type: {} }
})

Users.Save({
    name: 'joe',
    age: 27,
    hobbie: ['programin', 'read books'],
    skills: { smart: 'true' } })
```
