import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { SubCategoryPage } from '../sub-category/sub-category';
import Swiper from 'swiper';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

declare var $:any;
// declare var Swiper:any;

@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {
  public images:any;
  activeCategory:any;
  constructor(public http:HttpClient,public navCtrl: NavController, public navParams: NavParams) {
    /*
    [
      {
        category : "IT",
        pdf : [1,2,3]
      },
      {
        category : "CE",
        pdf : [4,5,6]
      }
    ]
    */
     // this.http.get("./assets/data/data.json").subscribe(res=>{
     //   let res2:any = res
     //   console.log(res2.users)
     //   this.images = res2.users;  
     //   // console.log(this.images)
     // })

    this.images = [{
        "category": "Document(1)",
        "id": [1],
        "image": "assets/imgs/1.jpg"
      }, {
        "category": "Document(2)",
        "id": [4, 1, 2],
        "image": "assets/imgs/2.jpg"
      }, {
        "category": "Document(3)",
        "id": [3, 1, 2],
        "image": "assets/imgs/3.jpg"
      }, {
        "category": "Document(4)",
        "id": [4],
        "image": "assets/imgs/4.jpg"
      }, {
        "category": "Document(5)",
        "id": [1, 2, 3],
        "image": "assets/imgs/5.jpg"
      }, {
        "category": "Document(6)",
        "id": [4, 3, 1],
        "image": "assets/imgs/6.jpg"
      }, {
        "category": "Document(7)",
        "id": [3],
        "image": "assets/imgs/7.jpg"
      }, {
        "category": "Document(8)",
        "id": [2, 1, 3],
        "image": "assets/imgs/8.jpg"
      }]
    this.activeCategory = this.images[0];
  }

  ionViewDidLoad() {
      var mySwiper = new Swiper('.swiper-container', {
          // Optional parameters
          direction: 'horizontal',
          loop: false,
          effect:'coverflow',
          freeMode:true,
          freeModeSticky:true,
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false
          },
          shortSwipes:false          
      })
      mySwiper.on('slideChangeTransitionEnd', ()=> {
          console.log('slide changed',mySwiper.activeIndex);
          this.activeCategory = this.images[mySwiper.activeIndex];
      });
  }
  category(item){
    console.log(item)
    this.navCtrl.setRoot(SubCategoryPage,{data:item});
  }

}
