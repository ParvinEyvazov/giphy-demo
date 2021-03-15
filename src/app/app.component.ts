import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { MicroService } from './services/micro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('input') input;

  API_KEY = 'OseukRU47oPpVHxynLs6Ma9x6H3CI8Yw';
  search_text: string;
  gif_data;
  sticker_data;
  images: string[] = [];

  gifs: string[] = [];
  stickers: string[] = [];

  touchTime = 0;

  constructor(private http: HttpClient, private microService: MicroService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.input.update.pipe(debounceTime(1000)).subscribe((value) => {
      this.findContent(value);
    });
  }

  findContent(search_text) {
    if (search_text) {
      this.getGifs(search_text)
        .toPromise()
        .then((data) => {
          this.gif_data = data;
          this.showGifs(this.gif_data);
        });
      this.getStickers(search_text)
        .toPromise()
        .then((data) => {
          this.sticker_data = data;
          this.showStickers(this.sticker_data);
        });
    }
  }

  getGifs(search_text) {
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=${search_text}`;
    return this.http.get(url);
  }

  getStickers(search_text) {
    let url = `https://api.giphy.com/v1/stickers/search?api_key=${this.API_KEY}&q=${search_text}`;
    return this.http.get(url);
  }

  showGifs(gif_data) {
    this.gifs.length = 0;
    let gif_array = gif_data.data;
    gif_array.forEach((element) => {
      this.gifs.push(element.images.original.url);
    });
  }

  showStickers(sticker_data) {
    this.stickers.length = 0;
    let gif_array = sticker_data.data;
    gif_array.forEach((element) => {
      this.stickers.push(element.images.original.url);
    });
  }

  copyString(string) {
    this.microService.copyMessage(string);
  }

  //detecting double click
  clickMe() {
    if (this.touchTime == 0) {
      // set first click
      this.touchTime = new Date().getTime();
    } else {
      // compare first click to this click and see if they occurred within double click threshold
      if (new Date().getTime() - this.touchTime < 800) {
        // double click occurred
        this.touchTime = 0;
      } else {
        // not a double click so set as a new first click
        this.touchTime = new Date().getTime();
      }
    }
  }
}
