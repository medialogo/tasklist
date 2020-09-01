import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})

export class TaskListPage implements OnInit {

  tasks: { name: string}[] = [
    {name: 'ステゴザウルス'},
    {name: 'プテラノドン'}
  ];
  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if ('tasks' in localStorage){
      this.tasks = JSON.parse(localStorage.tasks);
    }
  }


  async changeTask(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'タスクの変更',
      buttons: [
        {
          text: '削除',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Destructive clicked' + index);
            this.tasks.splice(index, 1);
            localStorage.tasks = JSON.stringify(this.tasks);
          }
        },
        {
          text: '変更',
          icon: 'create',
          handler: () => {
            console.log('Archive clicked');
            this._renameTask(index);
          }
        },
        {
          text: '閉じる',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    actionSheet.present();
  }
  async _renameTask(index: number) {
    const prompt = await this.alertController.create({
      header: '変更後のタスク',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'タスク',
          value: this.tasks[index].name,
        },
      ],
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
        },
        {
          text: '保存',
          handler: data => {
            console.log("data.task" + data.task);
            if (data.task.length > 1) {
              this.tasks[index] = { name: data.task };
              localStorage.tasks = JSON.stringify(this.tasks);
            }
          }
        }
      ]
    });
    prompt.present();
  }
}