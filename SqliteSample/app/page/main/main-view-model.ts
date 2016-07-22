import { Observable } from 'data/observable';
import * as Database from '../../services/DatabaseService';
import { PersonModel } from '../../services/person-model';

export class MainViewModel extends Observable {
    Person: PersonModel;

    constructor() {
        super();
        this.Person = new PersonModel();
    }

    insert() {
        Database.insert(this.Person).then(id => {
            console.log("insert success", id);
        }, error => {
            console.log("insert error", error);
        });
    }

    select() {
        Database.select(this.Person.TableName).then(rows => {
            for (var row in rows) {
                console.log("result", rows[row]);
            }
        }, error => {
            console.log("select error", error);
        });
    }

    remove(){
        Database.remove(this.Person.TableName, `firstname = '${this.Person.firstname}'`).then(id => {
            console.log("remove success", id);
        }, error => {
            console.log("remove error", error);
        });
    }

    update(){
        Database.update(this.Person, `where firstname = '${this.Person.firstname}'`).then(id =>{
            console.log("update success", id);
        }, error =>{
            console.log("update error", error);
        });
    }
}