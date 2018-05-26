import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,normalizeURL,Gesture,ModalController, Content } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SliderPage } from '../slider/slider';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var PDFJS;
declare var document;
declare var window;
declare var cordova: any;
declare var printJS:any;
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
  selector: 'page-sub-category',
  templateUrl: 'sub-category.html',
  providers:[File,FileOpener,FileTransfer,InAppBrowser,ThemeableBrowser,SocialSharing]
})


export class SubCategoryPage {
  @ViewChild(Content) content: Content;
  @ViewChild('zoom') zoom: ElementRef;


  public canvas:any;
  public pdf:any;
  public pageNo:any = 1;
  public scale:any = 0.25;

  public localFilePath:any;

  public pdfURL:string = 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf';
  public htmlContent:any;

  public allHtmlPages:any = [];
  public selectedCategory:any;

  public showFile:boolean = false;  // FALSE - all ;  TRUE : bookmarked only
  public bookmarkedList = JSON.parse(localStorage.getItem("favList")) ||[];
  constructor(public modalCtrl: ModalController,public http:Http,private socialSharing: SocialSharing,private themeableBrowser: ThemeableBrowser,private iab: InAppBrowser,private transfer: FileTransfer,private fileOpener: FileOpener,private file: File,public navCtrl: NavController, public navParams: NavParams) {
      this.selectedCategory = this.navParams.get("data");
      console.log(this.selectedCategory);
      console.log("bookded",this.bookmarkedList);
  }

  ngOnInit(){      
      this.loadHTML(this.selectedCategory.id);
  }


  loadHTML(data){
      data.forEach((item,k)=>{
          console.log(item);
          this.http.request("./assets/html/"+item+".html").map(res =>res.text()).subscribe(result=>{
            if(this.bookmarkedList.indexOf(this.selectedCategory.id[k]) == -1){
              this.allHtmlPages.push({book:false,data:result,filename:item+".html"});
            }else{
              this.allHtmlPages.push({book:true,data:result,filename:item+".html"});
            }
          });
      })
  }


  // loadHTML(index){
  //   this.http.request("./assets/html/1.html").map(res =>res.text()).subscribe(result=>{
  //     // console.log(result);
  //     if(this.bookmarkedList.indexOf(this.selectedCategory.id[index]) == -1){
  //       this.allHtmlPages.push({book:false,data:result});
  //     }else{
  //       this.allHtmlPages.push({book:true,data:result});
  //     }
  //      console.log(this.allHtmlPages)
  //     if(this.selectedCategory.id[index+1]){
  //       this.loadHTML(index+1)
  //      // this._pinchZoom(this.zoom.nativeElement, this.content);
  //     }
  //   })   
  // }


  openHTML(data,index){
    let indexId = this.selectedCategory.id[index];
    this.navCtrl.setRoot(HomePage,{data:data.data,filename:data.filename,id:indexId,subCategory:this.selectedCategory});
  }

  changeView(flag){
    if(this.showFile == flag){
      return; 
    }else{
      this.showFile = flag;
    }
    console.log(this.showFile);
  }

  ionViewDidEnter(): void {
    // this.http.request("./assets/html/1.html").ma(res=>{
    //   console.log(res);
    // })


    
    

    // Page must be fully rendered, ionViewDidLoad, doesnt work for this. Because it shows clientHeight without the margin of the header
   
  }

  private _pinchZoom(elm: HTMLElement, content: Content): void {
    const _gesture = new Gesture(elm);

    // max translate x = (container_width - element absolute_width)px
    // max translate y = (container_height - element absolute_height)px
    let ow = 0;
    let oh = 0;
    for (let i = 0; i < elm.children.length; i++) {
      let c = <HTMLElement>elm.children.item(i);
      ow = c.offsetWidth;
      oh += c.offsetHeight;
    }
    const original_x = content.contentWidth - ow;
    const original_y = content.contentHeight - oh;
    let max_x = original_x;
    let max_y = original_y;
    let min_x = 0;
    let min_y = 0;
    let x = 0;
    let y = 0;
    let last_x = 0;
    let last_y = 0;
    let scale = 1;
    let base = scale;
    
    _gesture.listen();
    // _gesture.on('pan', onPan);
    // _gesture.on('panend', onPanend);
    // _gesture.on('pancancel', onPanend);
    // _gesture.on('tap', onTap);
    _gesture.on('pinch', onPinch);
    // _gesture.on('pinchend', onPinchend);
    // _gesture.on('pinchcancel', onPinchend);

    function onPan(ev) {   
      setCoor(ev.deltaX, ev.deltaY);
      transform();
    }
    function onPanend() {
      // remembers previous position to continue panning.
      last_x = x;
      last_y = y;
    }
    function onTap(ev) {
      if (ev.tapCount === 2) {
        let reset = false;
        scale += .5;
        if (scale > 2) {
          scale = 1;
          reset = true;
        }
        setBounds();
        reset ? transform(max_x/2, max_y/2) : transform();
      }
    }
    function onPinch(ev) {
      // formula to append scale to new scale
      scale = base + (ev.scale * scale - scale)/scale

      setBounds();
      transform();
    }
    function onPinchend(ev) {
      if (scale > 4) {
        scale = 4;
      }
      if (scale < 0.5) {
        scale = 0.5;
      }
      // lets pinch know where the new base will start
      base = scale;
      setBounds();
      transform();
    }
    function setBounds() {
      // I am scaling the container not the elements
      // since container is fixed, the container scales from the middle, while the
      // content scales down and right, with the top and left of the container as boundaries
      // scaled = absolute width * scale - already set width divided by 2;
      let scaled_x = Math.ceil((elm.offsetWidth * scale - elm.offsetWidth) / 2);
      let scaled_y = Math.ceil((elm.offsetHeight * scale - elm.offsetHeight) / 2);
      // for max_x && max_y; adds the value relevant to their overflowed size
      let overflow_x = Math.ceil(original_x * scale - original_x); // returns negative
      let overflow_y = Math.ceil(oh * scale - oh);
      
      max_x = original_x - scaled_x + overflow_x;
      min_x = 0 + scaled_x;
      // remove added height from container
      max_y = original_y + scaled_y - overflow_y;
      min_y = 0 + scaled_y;

      setCoor(-scaled_x, scaled_y);
      console.info(`x: ${x}, scaled_x: ${scaled_x}, y: ${y}, scaled_y: ${scaled_y}`)
    }
    function setCoor(xx: number, yy: number) {
      x = Math.min(Math.max((last_x + xx), max_x), min_x);
      y = Math.min(Math.max((last_y + yy), max_y), min_y);
    }
    // xx && yy are for resetting the position when the scale return to 1.
    function transform(xx?: number, yy?: number) {
      console.log(xx);
      console.log(yy)
      elm.style.webkitTransform = `translate3d(${xx || x}px, ${yy || y}px, 0) scale3d(${scale}, ${scale}, 1)`;
    }
  }




  loadPDF(){
        console.log("view")
        var options = {
          headerColor:"#000000",
          showScroll:true
        }

        

        // window.openPDF('assets/pdf/dummuy.pdf');
        let url = "https://docs.google.com/viewer?url="+this.pdfURL;
        // const browser = this.iab.create(url,'_self');


        // const fileTransfer: FileTransferObject = this.transfer.create();
        // console.log(this.file.dataDirectory);
        // let path = cordova.file.dataDirectory + 'file.pdf';

        // fileTransfer.download('http://cdn.mozilla.net/pdfjs/tracemonkey.pdf',path  ).then((entry) => {
        //   console.log('download complete: ' + entry.toURL());
        //   window.openPDF(entry.toURL());
        // }, (error) => {
        //   // handle error
        // });


        // Download a file:
        // fileTransfer.download(url,this.file.dataDirectory+"pdf.pdf",true).then(entry=>{
        //   console.log(entry);
        //   // this.localFilePath = entry.toURL();

        //   // // AndroidNativePdfViewer.openPdfUrl(this.localFilePath, 'PDF', options,
        //   // // function(success){
        //   // //   console.log(this.localFilePath)
        //   // // }, function(error){
        //   // //   console.log("It didn't work!")
        //   // // });
        //   // window.openPDF('assets/pdf/dummuy.pdf');

        // }).catch(er=>{

        // });
      // Disable workers to avoid yet another cross-origin issue (workers need
      // the URL of the script to be loaded, and dynamically loading a cross-origin
      // script does not work).
      // PDFJS.disableWorker = true;

      // The workerSrc property shall be specified.
      PDFJS.workerSrc = './assets/js/pdf.worker.js';

      // Asynchronous download of PDF
      var loadingTask = PDFJS.getDocument(this.pdfURL);
      
      loadingTask.promise.then((pdf)=> {
        console.log('PDF loaded');
        this.pdf = pdf;
        this.openPdf(this.pageNo);
        // Fetch the first page        
      },(reason)=>{
        // PDF loading error
        console.error(reason);
      });




      // this.document.viewDocument(this.file.applicationDirectory+'assets/pdf/dummuy.pdf', 'application/pdf', options)
      // console.log(this.file.resolveLocalFilesystemUrl('assets/pdf/dummy.pdf'))
      // console.log(this.file.applicationDirectory);
      // console.log(this.file.)
      //  this.file.checkDir(this.file.applicationDirectory, 'assets/pdf/dummy.pdf').then(_ => 
      //    console.log('Directory exists',_)
      // ).catch(err => console.log('Directory doesnt exist',err))
      // this.navCtrl.setRoot(HomePage);   
  }

  openPdf(page){
        
        this.canvas = document.getElementById('the-canvas');
        var pageNumber = page;
        console.log()
        this.pdf.getPage(pageNumber).then((page)=> {
          console.log('Page loaded');
          
          // var scale = 0.55;
          var viewport = page.getViewport(this.scale);
          console.log(viewport)
          // Prepare canvas using PDF page dimensions
         
          var context = this.canvas.getContext('2d');
          this.canvas.height = 200;
          this.canvas.width = 150;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          var renderTask = page.render(renderContext);
          renderTask.then(()=> {
            console.log('Page rendered');
          });
        });

        this.canvas.addEventListener('click',(e)=>{
          console.log("click on canvas",e);
          this.pdfView();
        }, false);
        // this.canvas.addEventListener('mousemove', ()=>{
        //   console.log("mouse mousemove")
        // }, false);
        // this.canvas.addEventListener('mouseup', ()=>{
        //   console.log("mouse mouseup")
        // }, false);
  }  

  pdfView(){

     const options: ThemeableBrowserOptions = {
     statusbar: {
             color: '#fff'
         },
         toolbar: {
             height: 50,
             color: '#e8563c'
         },
         title: {
             color: '#fff',
             showPageTitle: false
         },
         closeButton: {
             wwwImage: 'assets/imgs/close.png',
             align: 'left',
             event: 'closePressed'
         },
         customButtons: [
            {
                wwwImage: 'assets/imgs/bookmark.png',
                align: 'right',
                event: 'bookmarkPressed'
            },
            {
                wwwImage: 'assets/imgs/share.png',
                align: 'right',
                event: 'sharePressed'
            },

         ],
         backButtonCanClose: true
    };
    // var pdfUrl = 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf'.;
    let url = "https://docs.google.com/viewer?url="+this.pdfURL;
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_self', options);
    browser.on('sharePressed').subscribe(res=>{
      // this.printer.isAvailable().then(res=>{
      //   console.log("printer available");
      //   let options: PrintOptions = {
      //      name: 'MyDocument',
      //      printerId: 'printer007',
      //      duplex: true,
      //      landscape: true,
      //      grayscale: true
      //    };

      //   this.printer.print(pdfUrl, options).then(succes=>{
      //     console.log("Succes to prinet",succes)
      //   }, err=>{
      //     console.log("err to prinet",err)
      //   });
      // }, err=>{
      //   console.log("err available",err)
      // });

       // printJS()

       this.share();
       // this.socialSharing.canShareVia(this.pdfURL).then(res=>{
       //   console.log("Shared,");
       // }).catch(err=>{
       //   console.log(err)
       // })
    })
    browser.on('bookmarkPressed').subscribe(res=>{
      console.log("CLICK book mark")
    })

    //  this.fileOpener.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'application/pdf')
    // .then(() => console.log('File is opened'))
    // .catch(e => console.log('Error openening file', e));
  	
  }
  share(){
    this.socialSharing.share(this.pdfURL).then(res=>{
         console.log("Shared,");
       }).catch(err=>{
         console.log(err)
       })
  }
  home(){
    this.navCtrl.setRoot(SliderPage);
  }

}
