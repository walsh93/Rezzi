import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../messages.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {

  selectedFile: ImageSnippet;

  constructor(public messagesService: MessagesService) { }

  processFile(imageInput: any) {
  	const file: File = imageInput.files[0];
  	const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      this.messagesService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.selectedFile.pending = false;
          this.selectedFile.status = 'ok';
        },
        (err) => {
          this.selectedFile.pending = false;
          this.selectedFile.status = 'fail';
          this.selectedFile.src = '';
        })
    });

    reader.readAsDataURL(file);
  }

  ngOnInit() {
  }

}
