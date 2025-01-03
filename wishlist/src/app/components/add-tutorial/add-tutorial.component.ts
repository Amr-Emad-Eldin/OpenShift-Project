// import { Component, OnInit } from '@angular/core';
// import { Tutorial } from 'src/app/models/tutorial.model';
// import { TutorialService } from 'src/app/services/tutorial.service';
//
// @Component({
//   selector: 'app-add-tutorial',
//   templateUrl: './add-tutorial.component.html',
//   styleUrls: ['./add-tutorial.component.css']
// })
// export class AddTutorialComponent implements OnInit {
//
//   tutorial: Tutorial = {
//     username: '',
//     email: '',
//     password: '',
//     phoneNumber: ''
//
//   };
//   submitted = false;
//
//   constructor(private tutorialService: TutorialService) { }
//
//   ngOnInit(): void {
//   }
//
//   saveTutorial(): void {
//     const data = {
//       title: this.tutorial.title,
//       description: this.tutorial.description
//     };
//
//     this.tutorialService.create(data)
//       .subscribe({
//         next: (res) => {
//           console.log(res);
//           this.submitted = true;
//         },
//         error: (e) => console.error(e)
//       });
//   }
//
//   newTutorial(): void {
//     this.submitted = false;
//     this.tutorial = {
//       username: '',
//       email: '',
//       password: '',
//       phoneNumber: ''
//     };
//   }
//
// }
