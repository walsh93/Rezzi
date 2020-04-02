import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../messages.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
}

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  selectedFile: ImageSnippet;
  @Output() public imageRefEmitter = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<ImageModalComponent>, public messagesService: MessagesService) { }

  processFile(imageInput: any) {
  	const file: File = imageInput.files[0];

    this.selectedFile = new ImageSnippet();

    this.selectedFile.pending = true;
    this.messagesService.uploadImage(file).subscribe(
      (res) => {
        console.log(res);
        console.log(res.body["url"]);
        this.selectedFile.pending = false;
        this.selectedFile.status = 'ok';
        this.imageRefEmitter.emit({ display_name: file.name, src: res.body["url"] });
      },
      (err) => {
        this.selectedFile.pending = false;
        this.selectedFile.status = 'fail';
      });
  }

  ngOnInit() {
  }

}
