import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  title = 'タスク登録';
  tasks: { name: string}[] = [
  ];
  task: string;


  constructor(private activatedRoute: ActivatedRoute) { }

  ionViewWillEnter() {
    if ('tasks' in localStorage) {
      this.tasks = JSON.parse(localStorage.tasks);
    }
  }
  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  addTask() {
    this.tasks.push({
      name: this.task
    });
    localStorage.tasks = JSON.stringify(this.tasks);
    this.task = '';
  }

}
