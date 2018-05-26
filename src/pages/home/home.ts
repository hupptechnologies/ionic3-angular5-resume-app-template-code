import { Component } from '@angular/core';
import { NavController,NavParams,ToastController, LoadingController } from 'ionic-angular';
import { SliderPage } from '../slider/slider';
import { SubCategoryPage } from '../sub-category/sub-category';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file';
import { WindowRef } from '../../providers/WindowRef';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
declare var cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public data:any;
	public htmlID:number;
	public flag:boolean = false;
	public any:Array<any> = [];
	public subCategory;
	public folderpath:any;
	public window:any; 
	constructor(public navCtrl: NavController,public navParams:NavParams,private toastCtrl: ToastController,private http: Http, private file: File,private winRef: WindowRef,private loadinCtrl: LoadingController,private socialSharing: SocialSharing,private emailComposer: EmailComposer) {
		this.data = this.navParams.get("data");		
		this.htmlID = parseInt(this.navParams.get("id"));
		this.subCategory = this.navParams.get("subCategory")
		let list = JSON.parse(localStorage.getItem("favList")) || [];
		let index = list.indexOf(this.htmlID);
		if(index > -1){
			this.flag = true
		}
		this.folderpath = this.file.dataDirectory;
		this.window = this.winRef.nativeWindow;
	}
	toast(msg){
		 let toast = this.toastCtrl.create({
		    message: msg,
		    duration: 1000,
		    position: 'bottom'
		  });
		  toast.present()
	}

	bookmark(){
		this.any = JSON.parse(localStorage.getItem("favList")) || [];
		let index = this.any.indexOf(this.htmlID);
		if(index == -1){
			this.any.push(this.htmlID);
			this.flag = true;
			localStorage.setItem("favList",JSON.stringify(this.any))
			this.toast("Bookmark success")
		}
	}

	unbookmark(){	
		console.log("UN-BOOKMARK")	
		this.any = JSON.parse(localStorage.getItem("favList")) || [];
		let index = this.any.indexOf(this.htmlID);
		this.any.splice(index,1);
		localStorage.setItem("favList",JSON.stringify(this.any));
		this.flag = false;
		this.toast("Removed bookmark")
	}
	done(){
		this.navCtrl.setRoot(SubCategoryPage,{data:this.subCategory});
	}

	print(){
		let loading = this.loadinCtrl.create({});
		loading.present();
		// console.log("print called>>>>>>>>");
		// let name = new Date().getTime() + '.pdf';
	 	let name = this.navParams.get("filename").replace('.html','.pdf');
	 	let options = {
	        documentSize: 'A3',
	        type: 'base64',
	        fileName:name
        }
        let fileUrl = "./assets/html/"+this.navParams.get("filename");
		cordova.plugins.pdf.fromData(this.data, options).then((res)=>{
	    	// console.log('res of pdf >>>>>>>>>',res);
	    	this.window.plugins.PrintPDF.print({
				data: res,
				type: 'Data',
				title: 'Print Document',
				success: ()=>{
					console.log('success');
					loading.dismiss();
				},
				error: (data)=>{
					data = JSON.parse(data);
					// console.log('failed: ' + data.error);
					loading.dismiss();
					if (data.error != undefined) {
						let toast = this.toastCtrl.create({ message: 'Unable to start print!', duration: 1500 });
	    				toast.present();
					}
				}
			});
	    }).catch((err)=>{
	    	// console.log('export error >>>>>>>>>',err);
	    	loading.dismiss();
	    	let toast = this.toastCtrl.create({ message: 'Unable to read pdf!', duration: 1500 });
	    	toast.present();
	    })
	}

	share(){
		let loading = this.loadinCtrl.create({});
		loading.present();
		let name = this.navParams.get("filename").replace('.html','.pdf');
		let options = {
	        documentSize: 'A3',
	        type: 'base64',
	        fileName:name
        }
        let fileUrl = "./assets/html/"+this.navParams.get("filename");
		cordova.plugins.pdf.fromData(this.data, options).then((res)=>{
			var blob = this.b64toBlob([res], 'application/pdf',undefined);			
			this.file.writeFile(this.folderpath, name, blob, { replace: true }).then((writeRes: any) => {
				console.log("res of write file >>>>>",JSON.stringify(writeRes));
				this.socialSharing.share(null,null, [writeRes.nativeURL]).then((res) => {
					console.log("Sharing success",res);
					loading.dismiss();
				}).catch((error) => {
					console.log("error while share >>>>>>>>>>>>>>>",error);
					loading.dismiss();
					let toast = this.toastCtrl.create({ message: 'Share failed!', duration: 1500 });
	    			toast.present();
				});				
				// let email = {
				//   	to: 'js1.hupp@gmail.com',		 		 
				//   	attachments: [writeRes.nativeURL],
				//   	subject: 'Resume'
				// };
				// this.emailComposer.open(email);
				// loading.dismiss();
			},(error) => {	
				// console.log("error while write >>>>>>>>>>>>>>>",error);
				loading.dismiss();
				let toast = this.toastCtrl.create({ message: 'Unable to read pdf!', duration: 1500 });
				toast.present();				
			})
		}).catch((err)=>{
			loading.dismiss();
			let toast = this.toastCtrl.create({ message: 'Unable to read pdf!', duration: 1500 });
	    	toast.present();
		});
	}

	b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;
		var byteCharacters = atob(b64Data);
		var byteArrays = [];
		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		  var slice = byteCharacters.slice(offset, offset + sliceSize);
		  var byteNumbers = new Array(slice.length);
		  for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		  }
		  var byteArray = new Uint8Array(byteNumbers);
		  byteArrays.push(byteArray);
		}
		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

}
