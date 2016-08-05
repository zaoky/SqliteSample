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

    onItemTap(args: ItemEventData) {
        let model = this.PersonList.getItem(args.index);
        this.Person.ID = model.ID;
        this.Person.CreatedAt = model.CreatedAt;
        this.Person.firstname = model.firstname;
        this.Person.lastname = model.lastname;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Person', value: this.Person });
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
            for (let i = 0; i < rows.length; i++) {
                let model = new PersonModel();
                model.ID = rows[i]["ID"];
                model.firstname = rows[i]["firstname"];
                model.lastname = rows[i]["lastname"];
                model.CreatedAt = rows[i]["CreatedAt"];
                if ((this.PersonList.filter(person => person.ID == model.ID)).length === 0) {
                    this.PersonList.push(model);
                }
            }
            this.Person.firstname = '';
            this.Person.lastname = '';
            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Person', value: this.Person });
            this.set("PersonList", this.PersonList);
        }, error => {
            console.log("select error", error);
        });
    }

    remove() {
        if (this.Person.firstname != '') {
            Database.remove(this.Person.TableName, `firstname = '${this.Person.firstname}'`).then(id => {
                console.log("remove success", id);
                for (let p = 0; p < this.PersonList.length; p++) {
                    if (this.PersonList.getItem(p) === this.Person) {
                        this.PersonList.splice(p, 1);
                        break;
                    }
                }
                this.Person.firstname = '';
                this.Person.lastname = '';
                this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Person', value: this.Person });
                this.set("PersonList", this.PersonList);
            }, error => {
                console.log("remove error", error);
            });
        }
    }

    update() {
        if (this.Person.firstname) {
            Database.update(this.Person, `where firstname = '${this.Person.firstname}'`).then(id => {
                console.log("update success", id);
                for (let k = 0; k < this.PersonList.length; k++) {
                    let model = this.PersonList.getItem(k);
                    if (model.ID == this.Person.ID) {
                        model.firstname = this.Person.firstname;
                        model.lastname = this.Person.lastname;
                        this.PersonList.setItem(k, model);
                        break;
                    }
                }
                this.set("PersonList", this.PersonList);
                this.Person = new PersonModel();
                this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Person', value: this.Person });
            }, error => {
                console.log("update error", error);
            });
        }
    }
}