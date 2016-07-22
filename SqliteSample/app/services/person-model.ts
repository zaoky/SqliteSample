import { BaseModelInterface } from '../shared/base-model-interface';

export /**
 * PersonModel
 */
class PersonModel implements BaseModelInterface  {
    ID: number = 0;
    CreatedAt: string = new Date(Date.now()).toLocaleString();
    TableName: string = "person";
    firstname:string ="";
    lastname:string = "";
    constructor() {
    }
    
}