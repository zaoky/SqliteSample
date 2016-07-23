import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import * as Database from '../../services/DatabaseService';
import { PersonModel } from '../../services/person-model';
import { ItemEventData } from 'ui/list-view';

export class MainViewModel extends Observable {
    Person: PersonModel;
    PersonList: ObservableArray<PersonModel> = new ObservableArray<PersonModel>();
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
            let tempList = new ObservableArray<PersonModel>();
            for (var i = 0; i < rows.length; i++) {
                let model = new PersonModel();
                model.ID = rows[i]["ID"];
                model.firstname = rows[i]["firstname"];
                model.lastname = rows[i]["lastname"];
                model.CreatedAt = rows[i]["CreatedAt"];
                tempList.push(model);
                console.log("rows ", rows.length);
            }
            this.PersonList = tempList;
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