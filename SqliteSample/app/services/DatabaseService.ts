import { PersonModel } from '../services/person-model';
let Sqlite = require('nativescript-sqlite');


const dbConnection: Promise<any> = new Sqlite("my.db").then(db => {
   return db.execSQL("CREATE TABLE IF NOT EXISTS person (ID INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, CreatedAt TEXT)")
   .then(id => {
        console.log("table created", id);
        return Promise.resolve(db);
    }, error => {
        console.log("create table error", error);
        return Promise.reject(error);
    });
}, error => {
    console.log("open db error", error);
});

export function insert(entity:any): Promise<number> {
 
 let fields: string[] = [];
 let values: string[] = [];

  for(var row in Object.keys(entity)){
        if(Object.keys(entity)[row] != 'TableName' && Object.keys(entity)[row] != 'ID'){
            fields.push(`${Object.keys(entity)[row]}`);
            values.push(`'${entity[Object.keys(entity)[row]]}'`);
        }
    }

 let query: string = `INSERT INTO ${entity['TableName']} (${fields.join()}) values (${values.join()})`;  
    return dbConnection.then((db) => {
        return db.execSQL(query).then((value: number) => {
            return Promise.resolve(value);
        });
    })
}

export function select(table: string): Promise<string[]> {
    return dbConnection.then(db => db.all(`SELECT * FROM ${table}`));
}

export function remove(table:string, filter: string): Promise<number>{
    return dbConnection.then(db => db.execSQL(`DELETE FROM ${table} where ${filter}`));
}

export function update(entity:any, filter: string) {
    
    let fields: string[] = [];
    for(var row in Object.keys(entity)){
        if(Object.keys(entity)[row] != 'TableName' && Object.keys(entity)[row] != 'ID'){
            fields.push(` ${Object.keys(entity)[row]} = '${entity[Object.keys(entity)[row]]}'`);
        }
    }
    let query: string = `UPDATE ${entity['TableName']} set ${fields.join()} ${filter}`;
    return dbConnection.then(db => db.execSQL(query));
}
