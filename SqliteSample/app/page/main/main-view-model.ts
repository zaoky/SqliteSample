import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import * as Database from '../../services/DatabaseService';
import { PersonModel } from '../../services/person-model';
import { ItemEventData } from 'ui/list-view';
import { ListView } from 'ui/list-view';
import * as lodash from 'lodash';

export class MainViewModel extends Observable {
    Person: PersonModel;
    PersonList: ObservableArray<PersonModel> = new ObservableArray<PersonModel>();
    constructor() {
        super();
        this.Person = new PersonModel();
    }

    onItemTap(args: ItemEventData){
        this.Person = this.PersonList.getItem(args.index);
         this.set("Person", this.Person);
    }

    insert() {
        Database.insert(this.Person).then(id => {
            console.log("insert success", id);
            this.select();
        }, error => {
            console.log("insert error", error);
        });
    }

    select() {
        Database.select(this.Person.TableName).then(rows => {
            for (var i = 0; i < rows.length; i++) {
                let model = new PersonModel();
                model.ID = rows[i]["ID"];
                model.firstname = rows[i]["firstname"];
                model.lastname = rows[i]["lastname"];
                model.CreatedAt = rows[i]["CreatedAt"];
                if ((this.PersonList.filter(person => person.ID == model.ID)).length === 0) {
                    this.PersonList.push(model);
                }
                console.log("rows ", rows.length);
            }

            this.set("PersonList", this.PersonList);
        }, error => {
            console.log("select error", error);
        });
    }

    remove() {
        Database.remove(this.Person.TableName, `firstname = '${this.Person.firstname}'`).then(id => {
            console.log("remove success", id);
        }, error => {
            console.log("remove error", error);
        });
    }

    update() {
        Database.update(this.Person, `where firstname = '${this.Person.firstname}'`).then(id => {
            console.log("update success", id);
        }, error => {
            console.log("update error", error);
        });
    }
}