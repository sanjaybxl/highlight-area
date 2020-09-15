import { Component, ContentChild, TemplateRef, OnInit, ComponentFactoryResolver, ViewContainerRef, Injector, ViewChild } from '@angular/core';

import { ShapeComponent } from './components/shape/shape.component';
import { ShapeProperties, MousePosition, Rectangle } from './model/shape';
import { ShapeType, ToolType } from './model/shape-types';
import { ShapeService } from './service/shape.service';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { DynamicFormComponent } from 'dynaform';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Highlight area';

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    svg: any;
    currentPosition: MousePosition = new MousePosition();

    shapeProperties: ShapeProperties = new ShapeProperties();

    selectedShape: ShapeType;
    shapeValue: string;

    selectedTool: ToolType;

    selectedComponent: ShapeComponent;

    isDragging: boolean = false;
    isDrawing: boolean = false;
    isResizing: boolean = false;
    isSelectingPoints: boolean = false;

    @ContentChild(TemplateRef) shapeTemplate: TemplateRef<any>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, private shapeService: ShapeService) {
        console.log('AppComponent constructor');
    }

    ngOnInit(): void {
        this.svg = document.querySelector('svg');
        this.selectedShape = ShapeType.Rectangle;
        // Load few areas on-load  - To fix
        // this.addShape();
    }

    ngOnChanges() {
    }

    clearShapes(): void {
        this.shapeService.removeAllShapeComponents();
        this.selectedShape = ShapeType.NoShape;
        this.shapeValue = ShapeType[this.selectedShape];
    }

    getShapes(): ShapeComponent[] {
        return this.shapeService.getShapeComponents();
    }

    getMousePosition(event: MouseEvent) {
        var CTM = this.svg.getScreenCTM();
        this.currentPosition.x = (event.clientX - CTM.e) / CTM.a;
        this.currentPosition.y = (event.clientY - CTM.f) / CTM.d;
    }

    private buildComponent(): any {
        return RectangleComponent;
    }

    onMouseDown(event): void {
        this.getMousePosition(event);
        if (event.target.classList.contains('draggable')) {
            console.log('CLASS is DRAGGABLE!!!!!!');
            this.selectedComponent = this.shapeService.findShapeComponent(event.target.id);
            if (this.selectedComponent) {
                console.log('FOUND COMPONENT:', this.selectedComponent);
                this.selectedComponent.isSelected = true;
                this.shapeProperties = Object.assign({}, this.selectedComponent.shape.shapeProperties);
                console.log(event.target.id, ' DRAGGING :', this.selectedComponent);
                this.startDragging();
            }
        } else if (event.target.classList.contains('resize')) {
            console.log('CLASS is RESIZE!!!!!!');
            this.selectedComponent = this.shapeService.findShapeComponent(event.target.id);
            if (this.selectedComponent) {
                console.log('FOUND RESIZECOMPONENT:', this.selectedComponent);
                this.isResizing = true;
            }
        } else if (this.selectedShape != ShapeType.NoShape && !this.isSelectingPoints) {
            let injector = Injector.create([], this.viewContainerRef.parentInjector);
            let factory = this.componentFactoryResolver.resolveComponentFactory(this.buildComponent());
            let component = factory.create(injector);
            this.selectedComponent = <ShapeComponent>component.instance;
            this.shapeService.setShapeComponent(this.selectedComponent);
            this.shapeProperties = new ShapeProperties();
            this.shapeProperties.name = this.selectedComponent.shape.shapeProperties.name;
            this.selectedComponent.shape.shapeProperties = Object.assign({}, this.shapeProperties);
            this.isDrawing = true;
            this.selectedComponent.startDrawing(this.currentPosition);
        }
    }

    onMouseMove(event): void {
        this.getMousePosition(event);
        if (this.selectedComponent && (this.isDrawing || this.isSelectingPoints)) {
            this.selectedComponent.draw(this.currentPosition);
        } else if (this.selectedComponent && this.isDragging) {
            console.log('DRAGGING move !!!');
            this.selectedComponent.drag(this.currentPosition);
        } else if (this.isResizing) {
            console.log('RESIZING move !!!');
            this.selectedComponent.resizeShape(this.currentPosition);
        }
    }

    onMouseUp(event): void {
        this.getMousePosition(event);
        console.log('mouse up svg : ', this.shapeService.getShapeComponents());
        if (this.isSelectingPoints) {
            console.log('SELECT POINTS!!!! ', this.selectedComponent);
            this.selectedComponent.setPoint(this.currentPosition);
        }
        this.selectedComponent.isSelected = true;
        // this.selectedShape = ShapeType.NoShape;
        this.shapeValue = ShapeType[this.selectedShape];
        this.isDrawing = false;
        this.isDragging = false;
        this.isResizing = false;
    }

    startDragging(): void {
        this.isDragging = true;
        console.log('startDragging()');
    }

    addShape() {
        for (var index = 0; index < 100; index++) {

            let injector = Injector.create([], this.viewContainerRef.parentInjector);
            let factory = this.componentFactoryResolver.resolveComponentFactory(this.buildComponent());
            let component = factory.create(injector);

            this.selectedComponent = <ShapeComponent>component.instance;
            console.log('create component ', this.selectedShape);
            console.log('component : ', this.selectedComponent);
            this.shapeProperties = new ShapeProperties();
            const rect = new Rectangle();
            rect.width = 100;
            rect.height = 100;
            rect.originX = rect.originX + index;
            rect.originY = rect.originY + index;

            this.selectedComponent.shape = rect;
            this.shapeProperties.name = index.toString();
            this.selectedComponent.shape.shapeProperties = Object.assign({}, this.shapeProperties);


            this.shapeService.setShapeComponent(this.selectedComponent);
        }

    }

}
