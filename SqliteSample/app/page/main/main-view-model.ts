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
        this.Person = this.PersonList.getItem(args.index);
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

    select(isUpdated: boolean = false) {
        Database.select(this.Person.TableName).then(rows => {
            for (var i = 0; i < rows.length; i++) {
                let model = new PersonModel();
                model.ID = rows[i]["ID"];
                model.firstname = rows[i]["firstname"];
                model.lastname = rows[i]["lastname"];
                model.CreatedAt = rows[i]["CreatedAt"];
                if ((this.PersonList.filter(person => person.ID == model.ID)).length === 0) {
                    this.PersonList.push(model);
                    console.log("pato");

                } else if (isUpdated == true) {
                    this.PersonList.setItem(this.PersonList.indexOf(this.Person), model);
                    console.log("pato2");

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
                for (var i = 0; i < this.PersonList.length; i++) {
                    if (this.PersonList.getItem(i) === this.Person) {
                        this.PersonList.splice(i, 1);
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
                this.select(true);
            }, error => {
                console.log("update error", error);
            });
        }
    }
}