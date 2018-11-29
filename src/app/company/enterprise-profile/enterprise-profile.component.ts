import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ParamMap } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable, of, bindCallback } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { EnterpriseService } from '../../services/enterprise.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshotExists, DocumentSnapshotDoesNotExist, Action } from 'angularfire2/firestore';
import { map, switchMap, mapTo } from 'rxjs/operators';
import { Enterprise, Subsidiary, ParticipantData, companyChampion, Department, companyStaff } from "../../models/enterprise-model";
import { Project } from "../../models/project-model";;
import * as moment from 'moment';
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { TaskService } from 'app/services/task.service';
import { coloursUser } from 'app/models/user-model';
import { Task, MomentTask,ActionItem } from "../../models/task-model";
import { PersonalService } from 'app/services/personal.service';

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}

declare interface CityData {
  id: string;
  name: string;
}

declare var require: any
declare var $: any;

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.css']
})
export class EnterpriseProfileComponent {

  // cities: CityData[];
  public show: boolean = false;
  public showEnterprise: boolean = false;
  public buttonName: any = 'Show';
  public btnName: any = 'Show';

  public btnTable: any = 'Show';
  public showUserTable: boolean = false;
  public showChamp: boolean = true;
  public btnChamp: any = 'Show';

  showChampBtn: boolean = true;

  public showProjectTable: boolean = false;
  public btnProjTable: any = 'Show';

  public showProj: boolean = true;
  public btnProj: any = 'Show';

  showProjBtn: boolean = true;

  public showCompanyTable: boolean = false;
  public btnCompanyTable: any = 'Show';
  public showCompany: boolean = true;
  public btnCompany: any = 'Show';

  public showDpt: boolean = false;
  public btnDpt: any = 'ShowDpt';

  tasks: Observable<Task[]>;
  myTasks: Observable<Task[]>;
  todayTasks: Observable<Task[]>;
  day1Tasks: Observable<Task[]>;
  day2Tasks: Observable<Task[]>;
  day3Tasks: Observable<Task[]>;
  day4Tasks: Observable<Task[]>;
  day5Tasks: Observable<Task[]>;
  day6Tasks: Observable<Task[]>;
  WeekTasks: Observable<Task[]>;
  MonthTasks: Observable<Task[]>;
  QuarterTasks: Observable<Task[]>;
  YearTasks: Observable<Task[]>;
  viewTasks: Observable<Task[]>;
  myTaskData: MomentTask;

  currentQuarter: string;
  currentYear: string;
  todayDate: string;

  selectedCompany: Enterprise;
  task: Task;
  selectedProject: Project;
  proj_ID: string;
  userChampion: ParticipantData;

  projects: Observable<Project[]>;
  projectsCollection: Observable<Project[]>;
  enterpriseCollection: Observable<Enterprise[]>;
  myprojects: Observable<Project[]>;
  currentCompany: Enterprise;
  currentCompanyId: string;

  company: Enterprise;
  location: Location;
  private listTitles: any[];
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private _router: Subscription;
  tes: any;
  x: any;
  user: firebase.User;
  myData: ParticipantData;
  userId: string
  companyData: Observable<{ name: string; by: string; byId: string; createdOn: string; id: string; location: string; sector: string; participants: ParticipantData; }>;

  testCompany: Enterprise;
  tryComp: Enterprise;
  comp: Observable<any>;
  dataId: {};
  compId: string;
  newCompany: Observable<Enterprise>;
  tasksImChamp: Observable<{}>;
  coloursUsers: Observable<firebase.User[]>;
  theTasks = [];
  CompanyTasks = [];
  OutstandingTasks = [];
  CurrentTAsks = [];
  UpcomingTAsks = [];
  ShortTermTAsks = [];
  MediumTermTAsks = [];
  LongTermTAsks = [];
  theseTasks: MomentTask[];

  /* departments */
  departments: Observable<Department[]>;
  subsidiaries: Observable<any[]>;
  dpt: Department;

  /* assets */
  assets: Observable<any[]>;
  selectedDepartment: Department;
  dp: string;
  projId: string;
  Champion: ParticipantData;
  selParticipantId: any;
  selectedParticipant: ParticipantData;
  selectedStaff: companyStaff;
  selParticipantName: any;
  staff: Observable<ParticipantData[]>;
  staff2: Observable<ParticipantData[]>;
  clients: Observable<ParticipantData[]>;
  compProjects: Observable<Project[]>;
  companyProjects: Observable<Project[]>;
  companyName: any;
  asset: { name: string; assetNumber: string; by: string; byId: string; companyName: string; companyId: string; createdOn: string; };
  client: { name: string; id: string; contactPerson: ParticipantData, by: string; byId: string; companyName: string; companyId: string; createdOn: string; };
  subsidiary: Subsidiary;
  period: string;
  today: string;
  daysInYear: number;
  testDay: number;
  counter: number;
  state: { clicks: number; show: boolean; };
  companystaff: companyStaff;
  companystaff2: companyStaff;
  contactPerson: ParticipantData;
  newPart: ParticipantData;
  day0label: string;
  day1label: string;
  day2label: string;
  day3label: string;
  day4label: string;
  day5label: string;
  day6label: string;
  start: any;
  finish: any;
  currentDay: number;
  currentDate: moment.Moment;
  // aCurrentDate: moment.Moment;
  aCurrentDate: string;
  // currentMonth: moment.Moment;
  week0Tasks: Observable<Task[]>;
  week1Tasks: Observable<Task[]>;
  week2Tasks: Observable<Task[]>;
  week3Tasks: Observable<Task[]>;
  quarter0Tasks: Observable<Task[]>;
  quarter1Tasks: Observable<Task[]>;
  quarter2Tasks: Observable<Task[]>;
  quarter3Tasks: Observable<Task[]>;

  month1Tasks: Observable<Task[]>;
  month2Tasks: Observable<Task[]>;
  month3Tasks: Observable<Task[]>;

  currentWeek: moment.Moment;
  currentMonth: string;
  week0label: moment.Moment;
  week1label: moment.Moment;
  week2label: moment.Moment;
  week3label: moment.Moment;
  subPeriod: string;

  quarter3label: moment.Moment;
  quarter2label: moment.Moment;
  quarter1label: moment.Moment;
  quarter0label: moment.Moment;

  month1label: moment.Moment;
  month2label: moment.Moment;
  month3label: moment.Moment;
  dptId: string;
  dept: Department;
  dept1: Department;
  dept2: Department;
  dept3: Department;
  dept4: Department;
  dept5: Department;
  dept6: Department;
  dept7: Department;
  dept8: Department;
  model: Date;
  model2: Date;
  depts: Observable<Department[]>;
  companyDpts: Observable<Department[]>;
  dptTasks: Observable<Task[]>;
  dptIntrayTasks: Observable<Task[]>;
  department: Department;
  selectedTask: Task;
  selectedDptTask: Task;

  //ActionItem

  actionItem: ActionItem;
  dptStaff: Observable<ParticipantData[]>;
  taskActions: Observable<ActionItem[]>;
  calldptStaff: Observable<ParticipantData[]>;
  selectedAction: ActionItem;
  actionItems: Observable<ActionItem[]>;
  mytaskActions: Observable<ActionItem[]>;
  staffId: string;
  selectedStaffId: string;
  setSui: ({ id: string; name: string });
  staffTasks: Observable<Task[]>;
  companyDptStaff: [ParticipantData];
  // deptStaff: [ParticipantData];
  companyDptsArray: Observable<Department[]>;
  // companyDptsArray: [Department];
  staffIds: string[];
  person: any;
  setStaff: ParticipantData;
  coloursUsersList: Observable<firebase.User[]>;
  optionsChecked = [];
  selectedParticipants: ParticipantData[];
  selectedPartId: string;
  selectedCity: ({ id: string; name: string; });
  selectedPart: any;
  cities: ({ id: number; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  compStaff: ({ id: number; name: string; email: string; phoneNumber: string; disabled?: undefined; } | { id: number; name: string; email: string; phoneNumber: string; disabled: boolean; })[];
  // compStaffList: ({ ParticipantData; disabled?: undefined; } | { ParticipantData; disabled: boolean; })[];
  compStaffList = [];
  enterpriseStaff: Observable<companyStaff>;
  qYear: string;
  aPeriod: string;
  workDay: string;
  workWeekDay: string;
  viewActions: Observable<ActionItem[]>;
  selectedActionItems = [];
  selectedActionParticipants = [];
  companyWeeklyActions: Observable<ActionItem[]>;
  actiondata: ActionItem;
  companyActions = [];
  dayTasks: Observable<ActionItem[]>;
  SIunits: ({ id: string; name: string; disabled?: undefined; } | { id: number; name: string; disabled: boolean; })[];
  actionParticipants: Observable<ParticipantData[]>;
  taskId: string;
  actionTask: Task;
  actionDepartment: Task;
  deptStaff: Observable<ParticipantData[]>;
  categorizedTasks: any;

  constructor(public afAuth: AngularFireAuth, private ts: TaskService, private pns: PersonalService, public es: EnterpriseService, public afs: AngularFirestore, location: Location, private renderer: Renderer, private element: ElementRef, private router: Router, private as: ActivatedRoute) {

    this.selectedCity = { id: '', name: '' };
    // this.setSui = { id: '', name: '' };
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.newPart = { name: "", id: "", email: "", phoneNumber: "" };
    this.counter = 1;
    this.selectedTask = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.actionItem = { name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: "" };
    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null };
    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "" };
    this.client = { name: "", id: "", contactPerson: null, by: "", byId: "", companyName: "", companyId: "", createdOn: "" };
    this.subsidiary = { name: "", by: "", byId: "", createdOn: "", Holding_companyName: "", companyId: "", id: "", location: "", sector: "", participants: null };
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" }
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
    this.contactPerson = { name: "", id: "", email: "", phoneNumber: "" };
    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.selectedStaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
    this.companystaff2 = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
    this.department = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null}
    this.selectedDepartment = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null }
    this.selectedAction = { name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "", createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay:""};
      

    let mmm = moment(new Date(), "DD-MM-YYYY");
    this.todayDate = moment(new Date(), "DD-MM-YYYY").format('dddd');
    console.log(this.todayDate);
    this.currentDay = moment(new Date(), "DD-MM-YYYY").dayOfYear();
    this.currentDate = moment(new Date(), "DD-MM-YYYY");
    console.log(this.currentDate.format('L'));

    this.cities = [
      { id: 1, name: 'Vilnius' },
      { id: 2, name: 'Kaunas' },
      { id: 3, name: 'Pavilnys', disabled: true },
      { id: 4, name: 'Pabradė' },
      { id: 5, name: 'Klaipėda' }
    ];
    
    this.SIunits = [
      { id: 'mm', name: 'Millimeters' },
      { id: 'cm', name: 'Centimeters' },
      { id: 'm', name: 'Meters' },
      { id: 'Km', name: 'Kilometers' },
      { id: 'in', name: 'Inches' },
      { id: 'ft', name: 'Feet' },
      { id: 'mi', name: 'Miles' },
      { id: 'yd', name: 'Yards' },
      { id: 'g', name: 'Grams' },
      { id: 'kg', name: 'Kilograms' },
      { id: 'm2', name: 'Area' },
      { id: 'm3', name: 'Volume' },
      { id: 'units', name: 'Units' },
      { id: 'items', name: 'Items' },
      { id: 9, name: 'Pavilnys', disabled: true },
    ];

    // this.testDay = moment(new Date().toISOString(), "DD-MM-YYYY").dayOfYear();
    console.log(moment().add(2, 'Q').toString());
    console.log(moment().add(4, 'M').toString());
    console.log(moment().add(4, 'M').get('M').toString());
    let ddref = moment().add(4, 'M');
    console.log(ddref.get('M'));
    console.log(moment(18 - 10 - 2018, "DD-MM-YYYY").dayOfYear().toString());
    this.currentMonth = moment(new Date(), "DD-MM-YYYY").month().toString();
    this.currentYear = moment(new Date(), "DD-MM-YYYY").year().toString();
    this.currentQuarter = moment(new Date(), "DD-MM-YYYY").quarter().toString();
    this.currentWeek = moment(new Date(), "DD-MM-YYYY");
    /* moment().dayOfYear();  moment.locale()*/
    console.log(moment(this.currentWeek).week());
    console.log(moment(new Date(), "DD-MM-YYYY").month);
    
    console.log(this.today);
    // let dayNo = moment(this.currentWeek, 'DD-MM-YYYY');
    let dayNo = moment(new Date(), "DD-MM-YYYY");
    console.log(dayNo);
    console.log(dayNo.dayOfYear());
    console.log(moment().format('MMMM'));
    console.log("Week" + " " + moment().week() + " " + "of the year" + " " + moment().year());
    
    this.day0label = moment(new Date(), "DD-MM-YYYY").format('dddd');
    this.day1label = moment(new Date(), "DD-MM-YYYY").add(1, 'd').format('dddd');
    this.day2label = moment(new Date(), "DD-MM-YYYY").add(2, 'd').format('dddd');
    this.day3label = moment(new Date(), "DD-MM-YYYY").add(3, 'd').format('dddd');
    this.day4label = moment(new Date(), "DD-MM-YYYY").add(4, 'd').format('dddd');
    this.day5label = moment(new Date(), "DD-MM-YYYY").add(5, 'd').format('dddd');
    this.day6label = moment(new Date(), "DD-MM-YYYY").add(6, 'd').format('dddd');

    this.week0label = moment(new Date(), "DD-MM-YYYY");
    this.week1label = moment(new Date(), "DD-MM-YYYY").add(1, 'w');
    this.week2label = moment(new Date(), "DD-MM-YYYY").add(2, 'w');
    this.week3label = moment(new Date(), "DD-MM-YYYY").add(3, 'w');

    this.month1label = moment(new Date(), "DD-MM-YYYY");
    this.month2label = moment(new Date(), "DD-MM-YYYY").add(1, 'M');
    this.month3label = moment(new Date(), "DD-MM-YYYY").add(2, 'M');
    
    this.quarter0label = moment(new Date(), "DD-MM-YYYY");
    this.quarter1label = moment(new Date(), "DD-MM-YYYY").add(1, 'Q');
    this.quarter2label = moment(new Date(), "DD-MM-YYYY").add(2, 'Q');
    this.quarter3label = moment(this.currentDate, "DD-MM-YYYY").add(3, 'Q');

  }
  
  addtime(number, timeArg) {
    console.log(number + timeArg);
    this.todayDate = moment(new Date(), "DD-MM-YYYY").add(number, timeArg).format('dddd');
    console.log(this.todayDate);
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;

    } else {
      setTimeout(function () {
        body.classList.add('sidebar-mini');
        // misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  // checkTask(){
  //   var array = this.CompanyTasks
  //   var str = array[0];
  //   const re = /ago/gi;
  //       for (var i = 0; i < array.length; i++) {
  //         if (str.search(re) == -1) {
  //           this.theseTasks.push(this.myTaskData);
  //           console.log("It hasn't passed");
  //         } 
  //       else {
  //           this.OutstandingTasks.push(this.myTaskData);
  //           console.log("It has passed");
  //         }
  //       }
  // }

  saveDept() {
    console.log(this.dpt);
    console.log(this.userId);
    console.log(this.user);

    this.dpt.companyName = this.companyName;
    this.dpt.companyId = this.compId;
    this.dpt.by = this.user.displayName;

    this.dpt.byId = this.userId;
    this.dpt.createdOn = new Date().toString();
    console.log(this.dpt);

    // this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments').add(this.dpt);
    let dptRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
      dptRef.add(this.dpt).then(function (Ref) {
      console.log(Ref.id); let dptId = Ref.id;
      dptRef.doc(dptId).update({ 'id': dptId });
    });

    this.dpt = { name: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", head: null }
  }

  saveAsset() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);

    this.asset.companyName = this.companyName;
    this.asset.companyId = this.compId;
    this.asset.by = this.user.displayName;

    this.asset.byId = this.userId;
    this.asset.createdOn = new Date().toString();
    console.log(this.dpt);

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('assets').add(this.asset);

    this.asset = { name: "", assetNumber: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "" };
  }

  saveSubsidiary() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);
    let companyId = this.compId


    let compRef;  //ID of the new company that has been created under User/myEnterprises

    this.subsidiary.Holding_companyName = this.companyName;
    this.subsidiary.companyId = this.compId;
    this.subsidiary.by = this.user.displayName;

    this.subsidiary.byId = this.userId;
    this.subsidiary.createdOn = new Date().toString();

    let pUser = {
      name: this.user.displayName,
      email: this.user.email,
      id: this.user.uid,
      phoneNumber: this.user.phoneNumber
    };

    this.newPart = pUser;
    this.subsidiary.participants = [this.newPart];

    let partId = this.userId;
    let comp = this.subsidiary;

    let newRef = this.afs.collection('/Users').doc(this.userId).collection('myenterprises');
    let mycompanyRef = this.afs.collection<Enterprise>('Enterprises');
    mycompanyRef.doc(this.compId).collection('subsidiaries').add(this.subsidiary)
      .then(function (Ref) {
        console.log(Ref.id)
        let compRef = Ref.id;
        // newRef.doc(compRef).add({ 'id': compRef });
        newRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log(partId);
        console.log(compRef)
        mycompanyRef.doc(compRef).set(comp);
        newRef.doc(compRef).set(comp);
        mycompanyRef.doc(compRef).collection('Participants').doc(partId).set(pUser);
        console.log('enterprise ');
        mycompanyRef.doc(companyId).collection('subsidiaries').doc(compRef).update({ 'id': compRef });
        newRef.doc(compRef).update({ 'id': compRef });
        mycompanyRef.doc(compRef).update({ 'id': compRef });
      });

    console.log(this.subsidiary);
    this.subsidiary = { name: "", by: "", byId: "", createdOn: "", Holding_companyName: "", companyId: "", id: "", location: "", sector: "", participants: null };
  }

  saveClient() {
    console.log(this.asset);
    console.log(this.userId);
    console.log(this.user);
    console.log(this.contactPerson);

    this.client.contactPerson = this.contactPerson;
    this.client.by = this.user.displayName;
    this.client.byId = this.userId;

    this.client.companyName = this.companyName;
    this.client.companyId = this.compId;
    this.client.createdOn = new Date().toString();

    this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('clients').add(this.client);
    console.log(this.client);
    this.client = { name: "", id: "", contactPerson: null, by: "", byId: "", companyName: "", companyId: "", createdOn: "" };
  }

  selectStaff(){

    console.log(this.selectedPartId);
    let staffData: companyStaff;
        
    let docRef = this.afs.collection('Enterprises').doc(this.compId).collection<companyStaff>('Participants').doc(this.selectedPartId);
    docRef.ref.get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.get('id'));
        console.log(doc.get('name'));
        console.log(doc.get('email'));
        console.log(doc.get('phoneNumber'));
        console.log("Document data:", doc.data());
        
        const id = doc.get('id');
        const name = doc.get('name');
        const email = doc.get('email');
        const phoneNumber = doc.get('phoneNumber');
        const by = doc.get('by');
        const byId = doc.get('byId');
        const createdOn = doc.get('createdOn');
        
        staffData.name = name;
        staffData.id = id;
        staffData.email = email;
        staffData.phoneNumber = phoneNumber;
        staffData.by = by;
        staffData.byId = byId;
        staffData.createdOn = createdOn;
      
        // staffData = doc.data() as companyStaff
      } else {
        console.log("No such document!");
      }
      
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    console.log(staffData);
    this.selectedStaff = staffData;
    console.log(this.selectedStaff);
  }

  check(){
    console.log(this.selectedStaff);
  }

  selectUser(x) {
    let staff = {
      name: x.name,
      email: x.email,
      id: x.id,
      phoneNumber: x.phoneNumber,
      by: this.user.displayName,
      byId: this.userId,
      createdOn: new Date().toString()
    };
    console.log(x);
    console.log(staff);
    this.companystaff = staff;
    console.log(this.companystaff);
    // this.saveNewStaff(this.companystaff)
    this.toggleChamp(); this.toggleUsersTable();
  }

  add2DptStaff(){
    this.es.add2DptStaff(this.compId, this.dp, this.companystaff, this.selectedTask, this.selectedAction )
  }

  
  /* selectTask */
  selectAction(action) {
    this.selectedAction = action;
  }

  saveNewStaff() {
    let partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.doc(this.companystaff.id).set(this.companystaff);
    console.log(this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
  }

  saveStaff() {
    console.log(this.userId);
    console.log(this.user);
    console.log(this.companystaff);

    this.companystaff.by = this.user.displayName;
    this.companystaff.byId = this.userId;
    this.companystaff.phoneNumber = this.user.phoneNumber;

    this.companystaff.createdOn = new Date().toString();

    let compStaff = this.companystaff;
    let colUsers = this.afs.collection('Users');
    let partRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants');
    partRef.add(this.companystaff).then(function (Ref) {
      let partId = Ref.id;
      colUsers.doc(partId).set(compStaff);
      partRef.doc(partId).update({ 'id': partId });
      colUsers.doc(partId).update({ 'id': partId });
    });
    console.log(this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };
  }
  
  deleteStaff(x) {
    this.afAuth.user.subscribe(user => {
      console.log(x); let staffId = x.id;
      //  delete from the enterprise's tasks
      let staffRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants').doc(staffId);
      staffRef.delete();
      //  delete from the user's tasks
    })
  }

  removeStaff(x) {
    this.afAuth.user.subscribe(user => {
      console.log(x); let staffId = x.id;
      //  delete from the enterprise's tasks
      let staffRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.dp).collection('Participants').doc(staffId);
      staffRef.delete();
      //  delete from the user's tasks
    })
  }

  setCompany() {

    this.currentCompany = this.es.currentCompany;
    console.log(this.currentCompany)

  }


  selectParticipant(x) {
    this.selectedParticipant = x;
    this.selParticipantId = x.id;
    this.Champion = x;
    // this.Champion.id = x.id;
    // this.Champion.email = x.email;
    console.log(this.Champion);
    this.selParticipantName = x.name;
    this.toggleChamp(); this.toggleUsersTable();
  }

  checkLeapYear() {
    let leapYear: boolean = false;
    let numberOfDays;
    leapYear = moment(this.currentYear).isLeapYear()
    console.log(leapYear);
    if (leapYear == true) {
      console.log('Its a leapYear');
      numberOfDays = 366
    }
    else {
      console.log('Its not leapYear');
      numberOfDays = 365
    }
    return numberOfDays
  }
  /* this.daysInYear  */

  changePeriod(action, period) {
    console.log(period + " " + action);
    let subPeriod;

    if (period == 'startWeek') {
      switch (action) {
        case 'previous': {
          subPeriod = 'startDay';
          let week$ = Number(this.currentWeek)
          if (this.currentWeek.week() > 1) {
            this.currentWeek.subtract(1, 'w');
            this.currentDate.subtract(7, 'd');
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }
        case 'next': {
          let week$ = Number(this.currentWeek)
          if (this.currentWeek.week() < 52) {
            // this.currentWeek = String(week$ + 1);
            this.currentWeek.add(1, 'w');
            this.currentDate.add(7, 'd');
            console.log(this.currentWeek);
            this.setDay('startDay');
            console.log(this.currentWeek);
          }
          break;
        }


        default:
          break;
      }
    }
    if (period == 'startMonth') {
      let ndays = this.currentDate.daysInMonth();
      console.log(ndays);
      switch (action) {
        case 'previous': {
          let week$ = this.currentWeek.week()
          let month$ = Number(this.currentMonth)
          if (month$ > 1) {
            month$ -= 1; console.log(moment(month$));
            this.currentMonth = String(month$)

            this.week0label.subtract(1, 'M');
            this.week1label.subtract(1, 'M');           
            this.week2label.subtract(1, 'M');         
            this.week3label.subtract(1, 'M');          
          }
          break;
        }
        case 'next': {
          let month$ = Number(this.currentMonth)
          if (month$ <= 11) {
            month$ += 1; console.log(moment(month$));
            this.currentMonth = String(month$)
            console.log(this.currentWeek.week());

            this.week0label.add(1, 'M');
            this.week1label.add(1, 'M');
            this.week2label.add(1, 'M');
            this.week3label.add(1, 'M');     
          }
          break;
        }

        default:
          break;
      }
    }

    if (period == 'startQuarter') {
      switch (action) {
        case 'previous': {
          let quarter$ = Number(this.currentQuarter);
          if (quarter$ > 1) {
            this.currentQuarter = String(quarter$ - 1);
            console.log(this.currentQuarter);

            this.month1label.subtract(1, 'Q');
            this.month2label.subtract(1, 'Q');
            this.month3label.subtract(1, 'Q');
          }
          break;
        }
        case 'next': {
          let quarter$ = Number(this.currentQuarter);
          if (quarter$ < 4) {
            this.currentQuarter = String(quarter$ + 1);
            console.log(this.currentQuarter);

            this.month1label.add(1, 'Q');
            this.month2label.add(1, 'Q');
            this.month3label.add(1, 'Q');   
          }
          break;
        }

        default:
          break;
      }
    }
    if (period == 'startYear') {
      subPeriod = 'startQuarter';
      switch (action) {
        case 'previous': {
          let year$ = Number(this.currentYear)

          this.currentYear = String(year$ - 1);
          console.log(this.currentYear);

          this.quarter0label.subtract(1, 'y');
          this.quarter1label.subtract(1, 'y');
          this.quarter2label.subtract(1, 'y');
          this.quarter3label.subtract(1, 'y'); 
          break;
        }
        case 'next': {
          let year$ = Number(this.currentYear)

          this.currentYear = String(year$ + 1);
          console.log(this.currentYear);


          this.quarter0label.add(1, 'y');
          this.quarter1label.add(1, 'y');
          this.quarter2label.add(1, 'y');
          this.quarter3label.add(1, 'y');  

          break;
        }

        default:
          break;
      }
    }

    else {
      console.log('something not right');
    }
    // this.setPeriod(period);

  }

  setDay(day) {
    // console.log(period);
    // this.period = this.currentWeek;

    let dayNo = moment(new Date(), 'DD-MM-YYYY').dayOfYear();
    // let periodWeek = 'startWeek';
    let period = 'startDay';
    if (day == 'day0') {
      console.log(dayNo);
      console.log(this.period);
      console.log(this.day0label);
      this.period = moment(this.currentDate, "DD-MM-YYYY").dayOfYear().toString();
      console.log(this.period);
      this.todayTasks = this.viewDateTasks(period, this.period);
    } if (day == 'day1') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(1, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day1Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day2') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(2, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day2Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day3') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(3, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day3Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day4') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(4, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day4Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day5') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(5, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day5Tasks = this.viewDateTasks(period, this.period);
    } if (day == 'day6') {
      this.period = moment(this.currentDate, "DD-MM-YYYY").add(6, 'd').dayOfYear().toString();
      console.log(this.period);
      this.day6Tasks = this.viewDateTasks(period, this.period);
    }
  }

  setWeek(week) {
    let period = 'startWeek';
    if (week == 'week0') {
      console.log(week);
      this.period = String(this.week0label.week());
      this.week0Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week1') {
      this.period = String(this.week1label.week());
      this.week1Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week2') {
      this.period = String(this.week2label.week());
      this.week2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (week == 'week3') {
      this.period = String(this.week3label.week());
      this.week3Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
  }

  setMonth(month) {
    let period = 'startMonth';
    if (month == 'month1') {
      console.log(month);
      this.period = String(this.month1label.month());
      this.qYear = String(this.month1label.year());
      // this.month1Tasks = this.viewDateTasks(period, this.period);
      this.month1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month == 'month2') {
      this.period = String(this.month2label.month());
      this.qYear = String(this.month2label.year());
      // this.month2Tasks = this.viewDateTasks(period, this.period);
      this.month2Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (month == 'month3') {
      this.period = String(this.month3label.month());
      this.qYear = String(this.month3label.year());
      // this.month3Tasks = this.viewDateTasks(period, this.period);
      this.month3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  setQuarter(quarter) {
    let period = 'startQuarter';
    if (quarter == 'quarter0') {
      console.log(quarter);
      this.period = String(this.quarter0label.quarter());
      this.qYear = String(this.quarter0label.year());
      // this.quarter0Tasks = this.viewDateTasks(period, this.period);
      this.quarter0Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter == 'quarter1') {
      this.period = String(this.quarter1label.quarter());
      this.qYear = String(this.quarter1label.year());      
      // this.quarter1Tasks = this.viewDateTasks(period, this.period);
      this.quarter1Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
    if (quarter == 'quarter2') {
      this.period = String(this.quarter2label.quarter());
      this.qYear = String(this.quarter2label.year());
      this.quarter2Tasks = this.viewDateTasks(period, this.period);
      console.log(this.period);
    }
    if (quarter == 'quarter3') {
      this.period = String(this.quarter3label.quarter());
      this.qYear = String(this.quarter3label.year());
      // this.quarter3Tasks = this.viewDateTasks(period, this.period);
      this.quarter3Tasks = this.mviewDateTasks(period, this.period, this.qYear);
      console.log(this.period);
    }
  }

  viewDateTasks(testPeriod, checkPeriod) {
    // this.viewTasks = this.afs.collection('Users').doc(this.userId).collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => { return ref.where(testPeriod, '==', checkPeriod) }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  mviewDateTasks(testPeriod, checkPeriod, year) {
    
    let viewTasksRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewTasks = viewTasksRef.collection('tasks', ref => ref
    .where(testPeriod, '==', checkPeriod)
    .where('startYear', '==', year))
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Task;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.viewTasks;
  }

  addTaskDptStaff(){
    this.es.addTaskDptStaff(this.compId, this.dp, this.companystaff, this.selectedTask)
  }

  setDptHead(){
    console.log(this.companystaff);
    let staff = {
      name: this.companystaff.name,
      email: this.companystaff.email,
      id: this.companystaff.id,
      phoneNumber: this.companystaff.phoneNumber,
      // by: this.user.displayName,
      // byId: this.userId,
      dateHeaded: new Date().toString()
    };
    console.log('the departmentID-->' + " " + this.selectedDepartment.name);
    this.selectedDepartment.head = staff;
    console.log(this.selectedDepartment);
    
    let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(this.selectedDepartment.id);
    deptDoc.update({ "head": staff});
  }

  selectDpt(dpt) {
    console.log(dpt);
    this.selectedDepartment = dpt;
    this.dptId = dpt.id;
  }

  showTasks(dpt){
    this.dptIntrayTasks = this.es.getDptTasks(this.compId, dpt.id);
  }

  showDpTasks(dptId) {
    this.dptTasks = this.es.getDptTasks(this.compId, dptId);
    this.dptStaff = this.es.getDptStaff(this.compId, dptId);
    this.calldptStaff = this.es.getDptStaff(this.compId, dptId);
    this.companyDptStaff = this.es.getDptStaffArray(this.compId, dptId);
  }

  dpTasks(dpt) {
    let dptId = dpt.id;
    this.selectDpt(dpt);
    this.deptStaff = this.es.getDptStaff(this.compId, dptId);
  }

  showUserTasks(staffId) {
    this.staffTasks = this.es.getDptStaffTasks(this.compId, this.dp, staffId);  
  }

  showTaskActions(task){
    this.selectTask(task)
    this.taskActions = this.es.getDptTasksActions(this.compId, this.dp, task.id)
  }

  viewMyTaskActions(task) {
    this.selectTask(task)
    this.mytaskActions = this.es.getMyTasksActions(this.userId, task.id)
  }

  showActions(){
    // this.actionItems = this.es.getActionItems(this.selectedTask, this.companystaff);
    this.actionItems = this.es.getActionItems(this.companystaff);
  }

  selectTask(TAsk) {
    console.log(TAsk);
    this.selectedTask = TAsk;
  }

  selectDeptTask(TAsk) {
    console.log(TAsk);
    this.selectedDptTask = TAsk;
  }

  // takeSIU(n){
  //   console.log(n);
  //   this.setSui = n;
  //   console.log(this.setSui);
    
  // }

  newActionn(action) {
    console.log(action);
    let dptId = this.dp;
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    action.createdOn = new Date().toString();
    action.taskId = this.selectedTask.id
    action.sui = this.setSui.id;

    console.log('department id-->' + " "  + this.dp);
    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name + " " + action.id);
    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('enterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
    })
  }

  newAction(action) {
    console.log(action);
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    let dptId = this.dp;
    action.createdOn = new Date().toString();
    action.taskId = this.selectedTask.id;
    action.projectId = this.selectedTask.projectId;
    action.projectName = this.selectedTask.projectName;
    action.companyId = this.selectedTask.companyId;
    action.companyName = this.selectedTask.companyName;
    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L');
    // action.startWeek = moment(action.startDate, 'DD-MM-YYYY').subtract(3, 'w').week().toString();
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.siu = this.setSui.id;
    console.log(action.sui);
    console.log(this.setSui.id);
    let mooom = action;
    console.log(mooom);
    
    console.log('the task--->' + this.selectedTask.name + " " + this.selectedTask.id);
    console.log('the department-->' + action.name);

    let userProjectDoc = this.afs.collection('Users').doc(this.staffId).collection('enterprises').doc(this.selectedTask.companyId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems')
    let EntRef = this.afs.collection('Enterprises').doc(this.selectedTask.companyId).collection('tasks').doc(this.selectedTask.id).collection<ActionItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
    })
  }

  newActionToday(action) {
    console.log(action);
    action.startDate = moment(new Date()).format('L');
    action.endDate = moment(new Date()).format('L');
    action.createdBy = this.user.displayName;
    action.byId = this.userId;
    let dptId = this.dp;
    action.createdOn = new Date().toString();
    action.taskId = this.taskId;
    action.startDate = moment(action.startDate).format('L');
    action.endDate = moment(action.endDate).format('L');
    // action.startWeek = moment(action.startDate, 'DD-MM-YYYY').subtract(3, 'w').week().toString();
    action.startWeek = moment(action.startDate, 'MM-DD-YYYY').week().toString();
    action.startDay = moment(action.startDate, 'MM-DD-YYYY').format('ddd').toString();
    action.endDay = moment(action.endDate, 'MM-DD-YYYY').format('ddd').toString();
    action.champion = this.myData;
    action.siu = this.setSui.id;
    console.log(action.sui);
    console.log(this.setSui.id);
    let mooom = action;
    console.log(mooom);
    let partId = this.selectedStaffId;
    console.log('the selectedStaffId--->' + this.selectedStaffId);

    console.log('the task--->' + this.selectedTask.name + " " + this.taskId);
    console.log('the department-->' + action.name);
    
    let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
    let userProjectDoc = this.afs.collection('Users').doc(partId).collection('enterprises').doc(this.compId);
    let userActionRef = userProjectDoc.collection('tasks').doc(this.taskId).collection<ActionItem>('actionItems');
    let deptDoc = this.afs.collection('Enterprises').doc(this.compId).collection<Department>('departments').doc(dptId);
    let actionRef = deptDoc.collection('tasks').doc(this.taskId).collection<ActionItem>('actionItems');
    let EntRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(this.taskId).collection<ActionItem>('actionItems');
    EntRef.add(action).then(function (Ref) {
      let newActionId = Ref.id;
      console.log(Ref);
      EntRef.doc(newActionId).update({ 'id': newActionId });
      compRef.doc(newActionId).set(action);
      compRef.doc(newActionId).update({ 'id': newActionId });
      actionRef.doc(newActionId).set(action);
      actionRef.doc(newActionId).update({ 'id': newActionId });
      userActionRef.doc(newActionId).set(action);
      userActionRef.doc(newActionId).update({ 'id': newActionId });
    })
  }

  saveUserId(staffId){
    console.log(staffId);
    console.log('the staff--->' + this.selectedStaffId);
    // this.staffId = staffId;
  }

/* addToDepatment */
  add2Dpartment(){
    console.log(this.selectedDepartment.name);
    console.log(this.selectedTask);
    this.ts.addToDepatment(this.selectedTask, this.selectedDepartment);
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
  }

  addStaff2Dpartment() {
    console.log(this.companystaff.name);
    console.log(this.selectedDepartment);
    this.es.addStaffToDepatment(this.compId, this.selectedDepartment, this.companystaff);
    this.companystaff = { name: "", phoneNumber: "", by: "", byId: "", createdOn: "", email: "", id: "" };    
  }

  addActionParticipants(){
    console.log(this.setStaff);
    const action = this.selectedAction;
    console.log(action);
  }

  changeDay(action) {
    switch (action) {
      case 'previous': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).subtract(1, 'd').format('L');
        console.log(this.aCurrentDate);
        this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');

        break;
      }
      case 'next': {
        this.aPeriod = this.aCurrentDate = moment(this.aCurrentDate).add(1, 'd').format('L');
        console.log(this.aCurrentDate);
        this.workDay = moment(this.aPeriod).format('LL');
        this.workWeekDay = moment(this.aPeriod).format('dddd');


        break;
      }

      default:
        break;
    }

    let testPeriod = "startDate";
    this.dayTasks = this.viewTodayAction(testPeriod, this.aPeriod);

  }


  initDiary() {
    // this.aCurrentDate = moment(new Date()).format('L');
    let testPeriod = "startDate";
    this.viewTodayAction(testPeriod, this.aCurrentDate);
  }

  viewTodayAction(testPeriod, checkPeriod) {
    let viewActionsRef = this.afs.collection('Enterprises').doc(this.compId);
    this.viewActions = viewActionsRef.collection<ActionItem>('WeeklyActions', ref => ref
      .where(testPeriod, '==', checkPeriod)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as ActionItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    return this.viewActions;
  }

  selectActions(e, action) {

    if (e.target.checked) {
      console.log();

      this.selectedActionItems.push(action);
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
      compRef.doc(action.id).set(action);
      console.log("action" + " " + action.name + " " + " has been added");
    } 
    else {
      this.selectedActionItems.splice(this.selectedActionItems.indexOf(action), 1);
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
      compRef.doc(action.id).delete();
    }
  }

  selectActionStaff(e, staff) {

    if (e.target.checked) {
      console.log();
      this.selectedActionParticipants.push(staff);
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).set(staff);
      console.log("staff" + " " + staff.name + " " + " has been added");
    }

    else {
      this.selectedActionParticipants.splice(this.selectedActionParticipants.indexOf(staff), 1);
      let compRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
      compRef.doc(this.selectedAction.id).collection('Participants').doc(staff.id).delete();
      console.log("staff" + " " + staff.name + " " + " has been removed");
    }
    this.showActionParticipants();
  }

  showActionParticipants(){
    let labourRef = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
    this.actionParticipants = labourRef.doc(this.selectedAction.id).collection<ParticipantData>('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  selectEditAction(action) {
    this.selectedAction = action;
  }

  refreshData() {
    this.aCurrentDate = moment(new Date()).format('L'); 
    console.log(this.aCurrentDate);
    this.company = this.testCompany;
    this.workDay = moment().format('LL');
    this.workWeekDay = moment(this.aPeriod).format('dddd');
  }

  addActionTime(action){
    console.log(action);
    console.log(action.start);
    console.log(action.end);
    if (action.projectId == "") {
      action.projectId = this.selectedTask.projectId;
    };

    if (action.projectName == "") {
      action.projectName = this.selectedTask.projectName;
    };

    if (action.companyId == "") {
      action.companyId = this.selectedTask.companyId;
    };

    if (action.companyName == "") {
      action.companyName = this.selectedTask.companyName;
    };
    console.log(action);
    let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedTask.projectId).collection<Enterprise>('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');    
    let compWeeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Task>('tasks').doc(action.taskId).collection<ActionItem>('actionItems');
    prjectCompWeeklyRef.doc(action.id).set(action);
    compWeeklyRef.doc(action.id).set(action);
    allMyActionsRef.doc(action.id).set(action);
    myTaskActionsRef.doc(action.id).set(action);
  }

  editAction(startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    console.log(moment(startDate, "YYYY-MM-DD"));
    console.log(moment(endDate, "YYYY-MM-DD"));

    this.selectedAction.startDay = moment(startDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.endDay = moment(endDate, 'YYYY-MM-DD').format('ddd').toString();
    this.selectedAction.startDate = moment(startDate).format('L');
    this.selectedAction.endDate = moment(endDate).format('L');
    console.log(this.selectedAction.startDate);
    console.log(this.selectedAction.endDate);

    // this.selectedAction.startDate = startDate;
    // this.selectedAction.endDate = endDate;
    this.selectedAction.startWeek = moment(startDate, "YYYY-MM-DD").week().toString();
    
    console.log('the actionItem-->' + this.selectedAction.name);
    
    let prjectCompWeeklyRef = this.afs.collection<Project>('Projects').doc(this.selectedAction.projectId).collection<Enterprise>('enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');    
    let weeklyRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions');
    let allMyActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<ActionItem>('actionItems');
    let myTaskActionsRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection<Task>('tasks').doc(this.selectedAction.taskId).collection<ActionItem>('actionItems');
    prjectCompWeeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    weeklyRef.doc(this.selectedAction.id).set(this.selectedAction);
    allMyActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
    myTaskActionsRef.doc(this.selectedAction.id).set(this.selectedAction);
    startDate = ""; endDate = null;
    this.selectedAction = {
      name: "", siu: "", targetQty: "", actualQty: "", start: null, end: null, projectId: "", companyId: "", companyName: "", projectName: "", workStatus: "", complete: null, id: "", taskId: "",
      createdOn: "", createdBy: "", byId: "", champion: "", participants: null, startDate: null, endDate: null, startWeek: "", startDay: "", endDay: ""
    };
  }

  compActions(){

    this.companyWeeklyActions = this.afs.collection('Enterprises').doc(this.compId).collection<ActionItem>('WeeklyActions',
      // ref => ref.where('startWeek', '==', moment().week().toString())
    ).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ActionItem;
        const id = a.payload.doc.id;
        data.startDate = moment(data.startDate, "MM-DD-YYYY").format('LL');
        data.endDate = moment(data.endDate, "MM-DD-YYYY").format('LL');
        this.actiondata = data;
        return { id, ...this.actiondata };
      }))
    );
    this.companyWeeklyActions.subscribe((actions) => {
      this.companyActions = actions;
      console.log(this.companyActions);
      console.log(this.companyActions.length);
    });

    let arraySize = this.companyActions.length;
    console.log(arraySize);

  }

  refreshCompany() {

    // this.es.compParams(this.company.id);
    console.log('kkkkkkk......... no bugs')
    this.projects = this.es.getCompanyProjects(this.compId);
    this.compProjects = this.es.getCompanyProjects(this.compId);
    this.myTasks = this.es.getMyCompanyTasks(this.compId, this.userId);
    this.tasksImChamp = this.es.getTasksImChamp(this.userId);
    this.departments = this.es.getCompanyDepts(this.compId);
    this.companyDpts = this.es.getCompanyDepts(this.compId);
    // this.companyDptsArray = this.es.getCompanyDepts(this.compId);
    // this.companyDptsArray = this.es.getCompanyDeptsArray(this.compId); compStaffList
    // this.staff = this.es.getStaff(this.compId);
    // this.compStaffList = this.es.getStaffList(this.compId);
    this.companyProjects = this.es.getCompanyProjects(this.compId);
    this.assets = this.es.getCompanyAssets(this.compId);
    this.clients = this.es.getClients(this.compId);
    this.subsidiaries = this.es.getCompanySubsidiaries(this.compId);
    

    // this.staff = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants').snapshotChanges().pipe(
    this.staff = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('Participants').snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as ParticipantData;
        this.newPart = data;
        this.compStaffList.push(this.newPart);
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.tasks = this.afs.collection('Enterprises').doc(this.compId).collection<Task>('tasks', ref => ref.orderBy('start')).snapshotChanges().pipe(
      map(b => b.map(a => {
        const data = a.payload.doc.data() as MomentTask;
        const id = a.payload.doc.id;
        this.myTaskData = data;
        this.myTaskData.when = moment(data.start, "YYYY-MM-DD").fromNow().toString();
        this.myTaskData.then = moment(data.finish, "YYYY-MM-DD").fromNow().toString();
        // this.categorizedTasks.push(this.myTaskData);
      let today = moment(new Date(), "YYYY-MM-DD");

      if (moment(data.start).isSameOrBefore(today) && moment(data.finish).isSameOrAfter(today)) {

        this.CurrentTAsks.push(data);
      };
      // outstanding tasks
      if (moment(data.finish).isBefore(today)) {
        this.OutstandingTasks.push(this.myTaskData);
      };
      // Upcoming tasks
      if (moment(data.start).isAfter(today)) {
        this.UpcomingTAsks.push(data);
        if (moment(data.start).isBefore(today.add(3, "month"))) {
          this.ShortTermTAsks.push(data);
        }
        if (moment(data.start).isAfter(today.add(6, "month"))) {
          this.MediumTermTAsks.push(data);
        }
        if (moment(data.start).isAfter(today.add(12, "month"))) {
          this.LongTermTAsks.push(data)
        }

      };

        this.CompanyTasks.push(this.myTaskData);
        // this.checkTask(this.CompanyTasks);
        return { id, ...data };
      }))
    );

    this.tasks.subscribe(ttask=>{
      console.log(ttask);
    })
    // console.log(this.es.currentCompanyId);
    // console.log(this.currentCompanyId);


    this.coloursUsers = this.pns.coloursUsers;
    this.coloursUsersList = this.pns.coloursUsers;

    this.projectsCollection = this.afs.collection('/Users').doc(this.userId).collection('projects').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Project;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.enterpriseCollection = this.afs.collection('/Users').doc(this.userId).collection('myenterprises').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Enterprise;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    return
  }

  deleteTask(task) {
    console.log(task.name + " " + "Removed");

    let taskId = task.id;
    let userRef = this.afs.collection('Users').doc(task.byId).collection('tasks').doc(taskId);;
    let champRef = this.afs.collection('Users').doc(task.champion.id).collection('tasks').doc(taskId);;
    let entRef = this.afs.collection('Enterprises').doc(this.compId).collection('tasks').doc(taskId);;
    userRef.delete();
    champRef.delete();
    entRef.delete();
  }

  deleteDept(x) {
      console.log(x);
      let deptId = x.id
      let id = this.compId; //set 
      //  delete from the enterprise's departments
      let tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('departments');
      tRef.doc(deptId).delete();
  }

  deleteSubs(x) {
      console.log(x);
      console.log(x.id);
      //  delete from the enterprise's subs
      let tRef = this.afs.collection<Enterprise>('Enterprises').doc(this.compId).collection('subsidiaries');
      tRef.doc(x.id).delete();
  }

  doc$(ref): Observable<Enterprise> {
    console.log(this.companyName)
    return
  }

  dataCall(): Observable<Enterprise> {
    this.comp = this.as.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.compId = id;
        this.es.compParams(id);
        console.log(id);
        const Ref = this.afs.collection<Enterprise>('Enterprises').doc(id);
        this.newCompany = Ref.snapshotChanges().pipe(
          map(doc => {
            const data = doc.payload.data() as Enterprise;
            const cname = doc.payload.get('name');
            this.companyName = cname;
            console.log(this.companyName);
            console.log('test if I get data on 781');
            console.log(data);
            this.testCompany = data;
            this.company = data;
            return { id, ...data };
          }));
        this.compActions();
        this.refreshCompany();
        return this.newCompany;
      })
    )
    return this.comp;
  }

  newTask() {
    console.log(this.task);

    let pr: Project;
    console.log(this.selectedCompany)
    this.task.createdBy = this.user.displayName;
    this.task.byId = this.userId;
    console.log(this.start);
    console.log(this.finish);
    // setting dates
    this.task.createdOn = new Date().toString();
    // this.task.start = this.start.toISOString()
    this.task.start = this.start, "YYYY-MM-DD";
    this.task.finish = this.finish, "YYYY-MM-DD";/* .format('LLLL') */
    this.task.startDay = String(moment(this.start, "YYYY-MM-DD").dayOfYear());
    this.task.startWeek = String(moment(this.start, "YYYY-MM-DD").week());
    this.task.startMonth = String(moment(this.start, "YYYY-MM-DD").month());
    this.task.startQuarter = String(moment(this.start, "YYYY-MM-DD").quarter());
    this.task.startYear = String(moment(this.start, "YYYY-MM-DD").year());
    this.task.finishDay = String(moment(this.finish, "YYYY-MM-DD").subtract(2, 'd').dayOfYear());
    this.task.finishWeek = String(moment(this.finish, "YYYY-MM-DD").week());
    this.task.finishMonth = String(moment(this.finish, "YYYY-MM-DD").month());
    this.task.finishQuarter = String(moment(this.finish, "YYYY-MM-DD").quarter());
    this.task.finishYear = String(moment(this.finish, "YYYY-MM-DD").year());
    this.task.complete = false;

    console.log(this.task);
    console.log(this.task.start);
    console.log(this.task.startDay);

    if (this.selectedProject.type === 'Enterprise') {
      this.task.companyName = this.company.name;
      this.task.companyId = this.compId;
      this.task.projectId = this.proj_ID;
      this.task.projectName = this.selectedProject.name;
      this.task.projectType = this.selectedProject.type;
      this.task.champion = this.userChampion;
    }

    else {
      this.task.companyName = "NAN";
      this.task.companyId = "NAN";
      this.task.projectId = "NAN";
      this.task.projectName = "NAN";
      this.task.projectType = "NAN";
      this.task.champion = this.myData;
    }

    console.log(this.task)

    this.ts.addTask(this.task, this.company);

    this.selectedCompany = { name: "", by: "", byId: "", createdOn: "", id: "", location: "", sector: "", participants: null };
    this.userChampion = { name: "", id: "", email: "", phoneNumber: "" };
    this.task = { name: "", champion: null, projectName: "", start: "", startDay: "", startWeek: "", startMonth: "", startQuarter: "", startYear: "", finish: "", finishDay: "", finishWeek: "", finishMonth: "", finishQuarter: "", finishYear: "", createdBy: "", createdOn: "", projectId: "", byId: "", projectType: "", companyName: "", companyId: "", trade: "", section: "", complete: null, id: "", participants: null, status: "" };
    this.selectedProject = { name: "", type: "", by: "", byId: "", companyName: "", companyId: "", createdOn: "", id: "", location: "", sector: "" };
  }

  //00000000000000000000000000000000000000000000000000000000000000000
  toggle() {
    this.show = !this.show;

    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleEnt() {
    this.showEnterprise = !this.showEnterprise;
    if (this.showEnterprise)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  toggleUsersTable() {
    this.showUserTable = !this.showUserTable;
    if (this.showUserTable) {
      this.btnTable = "Hide";
    }
    else { this.btnTable = "Show"; }
  }

  toggleProjTable() {
    this.showProjectTable = !this.showProjectTable;

    if (this.showProjectTable) {
      this.btnProjTable = "Hide";
    }
    else { this.btnProjTable = "Show"; }
  }

  toggleCompTable() {
    this.showCompanyTable = !this.showCompanyTable;

    if (this.showCompanyTable) {
      this.btnCompanyTable = "Hide";
    }
    else { this.btnCompanyTable = "Show"; }
  }

  showDptName() {
    this.showDpt = true;
  }

  toggleProj() {
    this.showProj = !this.showProj;

    if (this.showProj)
      this.btnProj = "Hide";
    else
      this.btnProj = "Show";
  }

  toggleComp() {
    this.showCompany = !this.showCompany;

    if (this.showCompany)
      this.btnCompany = "Hide";
    else
      this.btnCompany = "Show";
  }

  selectColoursUser(x) {
    let cUser = {
      name: x.name,
      email: x.email,
      id: x.id,
      phoneNumber: x.phoneNumber
    };
    this.userChampion = cUser;
    console.log(x);
    console.log(this.userChampion);
    this.toggleChamp(); this.toggleUsersTable();
  }

  toggleChamp() {
    this.showChamp = !this.showChamp;

    if (this.showChamp)
      this.btnChamp = "Hide";
    else
      this.btnChamp = "Show";
  }

  selectCompany(company) {
    console.log(company)
    this.selectedCompany = company;
    console.log(this.selectedCompany)
    this.toggleComp(); this.toggleCompTable();
  }


  selectProject(proj) {
    console.log(proj)
    this.proj_ID = proj.id;
    this.selectedProject = proj;
    this.toggleProj(); this.toggleProjTable();
  }

  // 0000000000000000000000000000000000000000000000000000000000000000


  // OnInit() {  }

  ngOnInit() {

    var tagClass = $('.tagsinput').data('color');

    if ($(".tagsinput").length != 0) {
      $('.tagsinput').tagsinput();
    }

    $('.bootstrap-tagsinput').addClass('' + tagClass + '-badge');
    
    this.afAuth.user.subscribe(user => {
      this.userId = user.uid;
      this.user = user;
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber
      }
      this.myData = myData;
      this.refreshData();
      this.dataCall().subscribe();
    })
  }
}