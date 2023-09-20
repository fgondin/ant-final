import { Component } from '@angular/core';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { AlertController, ToastController } from '@ionic/angular';
import { Task } from "./models/task.model";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: Task[] = [
    {id: 0, description: 'Lavar a louça', status: false},
    {id: 1, description: 'Passar o café', status: false},
    {id: 2, description: 'Assistir aula', status: false}
  ];

  constructor(
    private alert: AlertController, 
    private toast: ToastController) {

      let data = localStorage.getItem('TasksDB')

      if (data != null){
        this.tasks = JSON.parse(data);
      }
    }
  //Constructor é um método especial que serve para inicializar os membros da classe.
  //No angular, o construtor serve para injetar independências.

  async showToast(message: string){ //Typescript funciona de forma dinânima, então precisamos usar o async para definir que a função espere algo.
    const TOASTSCREEN = await this.toast.create({
      //Usando o await para a função entender que ela pode ser finalmente chamada.
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-config'
    });
    TOASTSCREEN.present();
  }

  getId(data: Task[]): number {
    let size:number = (data.length) + 1;
    return size;
  }

  //*ALERT SECTION*

  async updateAlert(){ 
    const ALERTSCREEN = await this.alert.create({ //propriedade "alert" sendo declarada no constructor.
      header: 'Update task?',
      inputs: [
        {
        name: 'task',
        type: 'text',
        placeholder: 'New name...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Update',
          handler: (form) =>{
            this.updateData(form);
          }
        }
      ]
    });

    ALERTSCREEN.present(); //Para tornar o alerta visível, é necessário usar o present.
  }

  async editAlert(task: Task){
    const ALERTSCREEN = await this.alert.create({
      header: 'Edit task',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          value: task.description
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Edit',
          handler: (form) => {
            task.description = form.newTask;
            localStorage.setItem('TarefasDB', JSON.stringify(this.tasks));
          }
        }
      ]
    });
    ALERTSCREEN.present();
  }

  //*ACTIONS SECTION*

  updateData(form: any){
    if(!form.task || form.task.trim() == ''){
      this.showToast('Please, enter a valid value');
      return;
    }

    let obj = {id: this.getId(this.tasks),
      description: form.task,
      status: false};

    this.tasks.push(obj);

    localStorage.setItem('TarefasDB', JSON.stringify(this.tasks));
  }

  eraseData(id: number){
    let index = this.tasks.findIndex(task => task.id == id);
    this.tasks.splice(index, 1);
    //Splice é usado para deletar elementos de uma array.
    
    localStorage.setItem('TarefasDB', JSON.stringify(this.tasks));
    this.showToast('Task removed');
  }

  changeStatus(task: Task){
    task.status = !task.status;
  }


}



