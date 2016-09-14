import { PersonModel } from '../services/person-model'
import * as Database from '../services/DatabaseService';
// import * as faker from 'faker';
let faker = require("faker");

let NUM_PEOPLE = 6;

export function generatePeople(): Array<PersonModel> {
    var personList: Array<PersonModel> = [];
    for (var i = 0; i < NUM_PEOPLE; i++) {
        var fname = faker.name.firstName(1);
        var lname = faker.name.lastName(1);
        var created = faker.date.recent(3).toDateString();

        let p = new PersonModel();
        p.firstname = fname;
        p.lastname = lname;
        p.CreatedAt = created;
        Database.insert(p).then(id => {
            console.log("insert success", id);
            p.ID = id;
        }, error => {
            console.log("insert error", error);
        });
        personList.push(p);
    }
    return personList;
}