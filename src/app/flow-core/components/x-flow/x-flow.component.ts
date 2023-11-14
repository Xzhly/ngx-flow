import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';
import {
  CommandInjectionToken,
  IGraphCommandService,
  IGraphConfig,
  IGraphData,
  IGraphMeta
} from '@/app/flow-core/interfaces';
import { Application } from '@/app/flow-core/models';
import { initApp } from '@/app/flow-core/utils/app.util';
import { XFlowGraphCommands } from '@/app/flow-core/constants';
import { CommandService, GraphProviderService, ModelService } from '@/app/flow-core/services';

@Component({
  selector: 'app-x-flow',
  templateUrl: './x-flow.component.html',
  styleUrls: ['./x-flow.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XFlowComponent implements OnInit, AfterViewInit {
  @ViewChild('XFlow') XFlow!: ElementRef;

  @ContentChildren('content') content!: QueryList<any>;

  @Input() meta!: IGraphMeta;

  @Input() graphConfig: IGraphConfig;

  @Input() onload?: (app: Application) => void;

  @Input() graphData!: IGraphData;

  haveCanvasComponent = false;

  app: Application;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.app = initApp(this.injector);
    this.app.start();
    if (this.onload) {
      this.onload(this.app);
    }
    setTimeout(async () => {
      // await this.app.commandService.executeCommand(XFlowGraphCommands.GRAPH_LAYOUT.id, { graphData: this.graphData });
      await this.app.commandService.executeCommand(
        XFlowGraphCommands.GRAPH_RENDER.id,
        { graphData: this.graphData },
        null
      );
      this.app.getGraphInstance().then(g => g.centerContent());
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.haveCanvasComponent = this.content.some(child => child && child.isXFlowCanvas);
  }
}