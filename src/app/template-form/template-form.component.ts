import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ConsultCepService } from '../shared/service/consult-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit, OnDestroy {

  private inscricao: Subscription;

  usuario: any = {
    nome: null,
    email: null,
  };

  endereco: any = {
    cep: null,
    numero: null,
    complemento: null,
    bairro: null,
    cidade: null,
    estado: null
  };

  constructor(
    private http: HttpClient,
    private cepService: ConsultCepService
  ) { }

  verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  consultaCEP(cep, form) {
    cep = cep.replace(/\D/g, '');

    if (cep !== '' && cep != null) {
      this.cepService.consultaCEP(cep).subscribe(
        data => this.populaDadosForm(data, form ),
        error => console.log(error)
      );
    }
  }

  aplicaCssErro(campo) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  populaDadosForm(dados, formulario ) {
  /*
    formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        cep: dados.cep,
        rua: dados.logradouro,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  */
    formulario.form.patchValue({
      endereco: {
        // cep: dados.cep,
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }
  resetaForm(formulario) {
    formulario.form.patchValue({
      endereco: {
        // cep: dados.cep,
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
  ngOnInit() {
  }
  onSubmit(formulario) {
    // console.log(form.value);
    // console.log(this.usuario);

    this.http.post(`https://httpbin.org/post`, JSON.stringify(formulario.value)).subscribe(
      data => {
        console.log(data);
        formulario.form.reset();
      },
      error => console.log(error)
    );
  }
  ngOnDestroy() {
  }
}
