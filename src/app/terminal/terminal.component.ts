import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// const ipc = require('electron').ipcRenderer;

import { Terminal } from 'xterm';
const {ipcRenderer} = (<any>window).require('electron');

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminalComponent implements OnInit {
  public term: Terminal;
  public container: HTMLElement;

  constructor() { }

  ngOnInit() {
    this.term = new Terminal();
    this.container = document.getElementById('terminal');
    this.term.open(this.container);

    this.term.onData((data) => {
      ipcRenderer.send('terminal.keystroke', data);
    });

    ipcRenderer.on('terminal.incomingData', (event, data) => {
      this.term.write(data);
    });
  }
}
