import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { DropdownService } from '../shared/service/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';
import { Subscription } from 'rxjs';
import { ConsultCepService } from '../shared/service/consult-cep.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {
  formulario: FormGroup;
  estados: EstadoBr[];

  inscricao: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultCepService
  ) {}

  ngOnInit() {
    /* this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      })
    });

    this.inscricao = this.dropdownService
      .getEstadosBr()
      .subscribe((data: EstadoBr[]) => {
        this.estados = data;
      });
  }
  onSubmit() {
    console.log(this.formulario.value);

    if (this.formulario.valid) {
      this.http
        .post(`https://httpbin.org/post`, JSON.stringify(this.formulario.value))
        .subscribe(
          data => {
            console.log(data);
            this.resetar();
          },
          error => console.log(error)
        );
    } else {
      console.log('Formulario invalido');
      this.verificaValidacoesForm(this.formulario);
    }
  }
  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      // console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();

      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }
  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo).valid &&
      (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
    );
  }
  verificaInvalidEmail() {
    const campoEmail = this.formulario.get('email');
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }
  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }
  populaDadosForm(dados) {
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
    this.formulario.get('nome').setValue('Tiago');
  }
  resetaForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;

    if (cep !== '' && cep != null) {
      this.cepService.consultaCEP(cep).subscribe(
          data => this.populaDadosForm(data),
          error => console.log(error)
        );
    }
  }
}
