import { Observable } from 'data/observable';
import * as Database from '../../services/DatabaseService';

export class MainViewModel extends Observable {
    _firstname: string = "";
    _lastname: string = "";

    constructor() {
        super();

    }

    public get FirstName(): string {
        return this._firstname;
    }


    public set FirstName(v: string) {
        this._firstname = v;
    }


    public get LastName(): string {
        return this._lastname;
    }


    public set LastName(v: string) {
        this._lastname = v;
    }

    insert() {
        Database.insert("people", "firstname, lastname", `'${this.FirstName}', '${this.LastName}'`).then(id => {
            console.log("insert success", id);
        }, error => {
            console.log("insert error", error);
        });
    }

    select() {
        Database.select("people").then(rows => {
            for (var row in rows) {
                console.log("result", rows[row]);
            }
        }, error => {
            console.log("select error", error);
        });
    }

    remove(){
        Database.remove("people", `firstname = '${this.FirstName}'`).then(id => {
            console.log("remove success", id);
        }, error => {
            console.log("remove error", error);
        });
    }
}