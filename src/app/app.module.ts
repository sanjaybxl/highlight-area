import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ColorPickerModule } from 'ngx-color-picker';
import { DynaformModule } from 'dynaform';
import { ShapeService } from './service/shape.service';

import { AppComponent } from './app.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { DynamicSvgDirective } from './directives/dynamic-svg.directive';
import { ShapeComponent } from './components/shape/shape.component';

@NgModule({
    declarations: [
        AppComponent,
        RectangleComponent,
        DynamicSvgDirective,
        ShapeComponent
    ],
    entryComponents: [
        ShapeComponent,
        RectangleComponent
    ],
    imports: [
        BrowserModule,
        ColorPickerModule,
        FormsModule,
        DynaformModule,
        ReactiveFormsModule,
    ],
    providers: [
        ShapeService
    ],
    bootstrap: [AppComponent],

})
export class AppModule { }
