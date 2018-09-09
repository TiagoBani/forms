import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';
import { FormDebugComponent } from './form-debug/form-debug.component';
import { DropdownService } from './service/dropdown.service';
import { ConsultCepService } from './service/consult-cep.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormDebugComponent,
    CampoControlErroComponent
  ],
  exports: [
    FormDebugComponent,
    CampoControlErroComponent
  ],
  providers: [
    DropdownService,
    ConsultCepService
  ]
})
export class SharedModule { }
