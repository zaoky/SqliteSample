let Sqlite = require('nativescript-sqlite');


const dbConnection: Promise<any> = new Sqlite("my.db").then(db => {
   return db.execSQL("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)")
   .then(id => {
        console.log("table created", id);
        return Promise.resolve(db);
    }, error => {
        console.log("create table error", error);
        return Promise.reject(error);
    });
}, error => {
    console.log("open db erro", error);
});

export function insert(firstname: string, lastname: string): Promise<number> {

    return dbConnection.then((db) => {
        return db.execSQL("INSERT INTO people (firstname, lastname) values (?,?)", [firstname, lastname]).then((value: number) => {
            return Promise.resolve(value);
        });
    })
}

export function select(): Promise<string[]> {
    return dbConnection.then(db => db.all("SELECT * FROM people"));
}

export function remove(filter: string){
    return dbConnection.then(db => db.execSQL("DELETE FROM people where " + filter));
}