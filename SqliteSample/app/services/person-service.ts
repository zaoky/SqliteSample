import * as fakeDataServiceModule from './fake-data-service'

export class PersonService {
    private _useHttpService: boolean;

    public loadPeople<T>():Promise<T>{
        if(this._useHttpService){
            return this.loadPeopleViaHttp<T>();
        }
        return this.loadPeopleViaFaker<T>();
    }

    private loadPeopleViaHttp<T>(): Promise<T>{
        return new Promise<T>(() => {});
    }

     private loadPeopleViaFaker<T>(): Promise<T>{
        return new Promise<T>((resolve, reject) => {
            let people = <any>fakeDataServiceModule.generatePeople();
            resolve(people);
        });
    }
}