import { Observable, EventData } from 'data/observable';
import { Page } from 'ui/page';
import { MainViewModel } from './main-view-model';
var  Sqlite = require( 'nativescript-sqlite' );

export function onLoaded(args:EventData) {   
    let viewModel = new MainViewModel();
    let page = <Page> args.object;
    page.bindingContext= viewModel;
}

