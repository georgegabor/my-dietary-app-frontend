import { AfterViewChecked, AfterViewInit, Component, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-cd',
  templateUrl: './cd.component.html',
  styleUrls: ['./cd.component.scss'],
})
export class CdComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('btn')
  btnEl!: ElementRef<HTMLButtonElement>;

  constructor(private readonly zone: NgZone, private readonly renderer: Renderer2) {}

  onClick() {
    console.log('onClick');
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngDoCheck() {
    console.log('ngDoCheck');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.setupClickListener();
  }

  ngAfterViewChecked() {
    console.log('CD performed (ngAfterViewChecked)');
  }

  private setupClickListener() {
    this.zone.runOutsideAngular(() => {
      // this.setupClickListenerViaNativeAPI();
      // this.setupClickListenerViaRenderer();
      this.setupClickListenerViaRxJS();
    });
  }

  private setupClickListenerViaNativeAPI() {
    this.btnEl.nativeElement.addEventListener('click', () => {
      console.log('onClick via Native API');
    });
  }

  private setupClickListenerViaRenderer() {
    this.renderer.listen(this.btnEl.nativeElement, 'click', () => {
      console.log('onClick Via Renderer');
    });
  }

  private setupClickListenerViaRxJS() {
    fromEvent(this.btnEl.nativeElement, 'click').subscribe(() => {
      console.log('onClick via RxJS');
    });
  }
}
