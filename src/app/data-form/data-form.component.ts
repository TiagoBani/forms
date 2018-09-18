import { VerificaEmailService } from './services/verifica-email.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, empty } from 'rxjs';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { DropdownService } from '../shared/service/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';
import { ConsultCepService } from '../shared/service/consult-cep.service';
import { FormValidations } from '../shared/form-validations';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // formulario: FormGroup;
  // estados: EstadoBr[];
  estados: Observable<EstadoBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];

  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
  }

  ngOnInit() {
    /* this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */
    // this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });
    this.formulario.get('endereco.cep').statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
          : empty()
        )
      )
      .subscribe( data => data ? this.populaDadosForm(data) : {} );

    /*
    this.dropdownService
      .getEstadosBr()
      .subscribe((data: EstadoBr[]) => {
        this.estados = data;
      });*/
    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();
  }
  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(
      values,
      FormValidations.requiredMinCheckbox(1)
    );
    /*
    this.formBuilder.array([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]);
    */
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }
  setarTecnologias() {
    this.formulario.get('tecnologias').setValue(['java', 'javascript', 'php']);
  }
  compararCargo(obj1, obj2) {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }
  submit() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => (v ? this.frameworks[i] : null))
        .filter(v => v !== null)
    });

    console.log(valueSubmit);

    this.http
        .post(`https://httpbin.org/post`, JSON.stringify(valueSubmit))
        .subscribe(
          data => {
            console.log(data);
            this.resetar();
          },
          error => console.log(error)
        );
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
      this.cepService
        .consultaCEP(cep)
        .subscribe(
          data => this.populaDadosForm(data),
          error => console.log(error)
        );
    }
  }

  validarEmail( formControl: FormControl ) {
    return this.verificaEmailService.verificarEmail(formControl.value)
    .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null));
  }
}
