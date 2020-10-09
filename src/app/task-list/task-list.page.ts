import { compilePipeFromMetadata } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { IonReorderGroup } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';


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
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

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
  showmessage(msg) {
    console.log(msg);
  }
  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    console.log('Before complete', this.tasks);
    this.tasks = ev.detail.complete(this.tasks);
    console.log('After complete', this.tasks);
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  async changeTask(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '変更・削除',
      buttons: [
        {
          text: '変更',
          icon: 'create',
          handler: () => {
            console.log('Archive clicked');
            this._renameTask(index);
          }
        },
        {
          text: '削除',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Destructive clicked' + index);
            this.presentAlertConfirm(index);
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
  async presentAlertConfirm(index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "「" + this.tasks[index].name + "」",
      message: 'をほんとうに削除してよろしいですか？',
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            return false;
          }
        }, {
          text: 'OK',
          handler: data => {
            console.log(this.tasks[index].name + " deleted");
            this.tasks.splice(index, 1);
            localStorage.tasks = JSON.stringify(this.tasks);

          }
        }
      ]
    });

    await alert.present();
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