import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { ResponseComponent } from './response/response.component';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { InterceptorModule } from './interceptor.module';
import { ApplicationComponent } from './application/application.component';
import { DataService } from "./data.service";
const routes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: 'response',
    component: ResponseComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResponseComponent,
    ApplicationComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    InterceptorModule,
    HttpModule

  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
