import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import * as Database from '../../services/DatabaseService';
import { PersonModel } from '../../services/person-model';
import { ItemEventData } from 'ui/list-view';
import { ListView } from 'ui/list-view';
import { PersonService } from '../../services/person-service'
let objectAssign = require("object-assign");

export class MainViewModel extends Observable {
    _person: PersonModel;
    PersonList: ObservableArray<PersonModel> = new ObservableArray<PersonModel>();
    private _personService: PersonService;
    _firstname: string;
    _lastname: string;

    constructor() {
        super();
        this.CurrentPerson = new PersonModel();
        this._personService = new PersonService();
        this.Firstname = '';
        this.Lastname = '';
        this.set('isLoading', true);
        this.select();
    }
    private pushPeople(peopleFromService: Array<PersonModel>) {
        peopleFromService.forEach(element => {
            this.PersonList.push(element);
        });
    }

    private onDataLoaded() {
        this.set("isLoading", false);
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'PersonList', value: this.PersonList });
    }

    onItemTap(args: ItemEventData) {
        let personItem = this.PersonList.getItem(args.index);
        this.CurrentPerson = objectAssign({}, personItem);
        Object.defineProperty(this.CurrentPerson, "TableName", {
            enumerable: false,
            configurable: false,
            value: personItem.TableName,
            writable: false
        });
    }

    insert() {
        Database.insert(this.CurrentPerson).then(id => {
            console.log("insert success", id);
            this.select();
        }, error => {
            console.log("insert error", error);
        });
    }

    select() {
        Database.select(this.CurrentPerson.TableName).then(rows => {
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
            this.CurrentPerson = new PersonModel();
            if (this.PersonList.length === 0) {
                this._personService.loadPeople().then((result: Array<PersonModel>) => {
                    this.pushPeople(result);
                    this.onDataLoaded();
                });
            }
        }, error => {
            console.log("select error", error);
        });
    }

    remove() {
        if (this.CurrentPerson.ID > 0) {
            Database.remove(this.CurrentPerson.TableName, `ID = '${this.CurrentPerson.ID}'`).then(id => {
                for (let p = 0; p < this.PersonList.length; p++) {
                    if (this.PersonList.getItem(p).ID === this.CurrentPerson.ID) {
                        this.PersonList.splice(p, 1);
                        break;
                    }
                }
                this.CurrentPerson = new PersonModel();
            }, error => {
                console.log("remove error", error);
            });
        }
    }

    update() {
        if (this.CurrentPerson.ID > 0 ) {
            Database.update(this.CurrentPerson, `where ID = '${this.CurrentPerson.ID}'`).then(id => {
                console.log("update success", id);
                for (let k = 0; k < this.PersonList.length; k++) {
                    let model = this.PersonList.getItem(k);
                    if (model.ID == this.CurrentPerson.ID) {
                        model.firstname = this.Firstname;
                        model.lastname = this.Lastname;
                        this.PersonList.setItem(k, model);
                        break;
                    }
                }
              this.CurrentPerson = new PersonModel();
            }, error => {
                console.log("update error", error);
            });
        }
    }

    public get Firstname(): string {
        return this._firstname;
    }

    public set Firstname(value: string) {
        this._firstname = value;
        this._person.firstname = value;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Firstname', value: this._firstname });
    }

    public get Lastname(): string {
        return this._lastname;
    }

    public set Lastname(value: string) {
        this._lastname = value;
        this._person.lastname = value;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: 'Lastname', value: this._lastname });
    }

    public get CurrentPerson(): PersonModel {
        return this._person;
    }

    public set CurrentPerson(value: PersonModel) {
        this._person = value;
        this.Firstname = this._person.firstname;
        this.Lastname = this._person.lastname;
    }
}