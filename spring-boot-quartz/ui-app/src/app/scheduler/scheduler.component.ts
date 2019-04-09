import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {SchedulerService} from './scheduler.service';
import {ServerResponseCode} from './response.code.constants';
import {Observable, Subscription} from 'rxjs/Rx';


@Component({
    template: require('./scheduler.component.html'),
    styles: ['.navbar-default a { color: white !important; }  select{padding: 7px; display: inline-block; /* font-weight: 400; */ color: #fff !important; background-color: #337ab7 !important; border-color: #337ab7; /* color: #212529; */ text-align: center; vertical-align: middle; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; background-color: transparent; border: 1px solid transparent; /* padding: .375rem .75rem; */ /* font-size: 1rem; */ line-height: 1.5; border-radius: 7px; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; }'],
})

export class SchedulerComponent implements OnInit, OnDestroy {
    schedulerForm: FormGroup;
    jobNameStatus: String;
    jobRecords = [];
    instances = [];
    jobRefreshTimerSubscription: Subscription;
    typeOfJobs: any[] = ['Start', 'Stop', 'Reboot'];
    default: any = 'Start';
    typeOfInstances: any[] = ['EC2', 'RDS'];
    defaultInstance: any = 'EC2';
    filteredInstances = [];
    isEditMode: boolean = false;
    staticDataTimeZone: any =
        {
            "IST": [
                {
                    "title": "",
                    "date": "",
                },
                {
                    "title": "New Year’s Day",
                    "date": "2019-01-02"
                },
                {
                    "title": "Coonation",
                    "date": "2019-01-02"
                }
            ],

            "EST": [
                {
                    "title": "",
                    "date": "",
                },
                {
                    "title": "Good Friday",
                    "date": "2019-04-06"
                }
            ],
            "GMT": [
                {
                    "title": "",
                    "date": "",
                },
                {
                    "title": "Good Friday",
                    "date": "2019-04-06"
                }
            ],
            "JST": [
                {
                    "title": "",
                    "date": "",
                },
                {
                    "title": "Good DAYY",
                    "date": "2019-04-06"
                }
            ]
        }
    holidayList: any;

    constructor(private _router: Router,
                private _fb: FormBuilder,
                private _schedulerService: SchedulerService,
                private _responseCode: ServerResponseCode) {
    }

    ngOnInit() {

        this.jobNameStatus = "";

        this.schedulerForm = this._fb.group({
            jobName: [''],
            year: [''],
            month: [''],
            day: [''],
            hour: [''],
            minute: [''],
            cronExpression: ['0 0/1 * 1/1 * ? *'],
            jobType: [''],
            instanceId: [''],
            instanceType: [''],
            timezone:['']
        });
        this.schedulerForm.controls['jobType'].setValue(this.default, {onlySelf: true});
        this.schedulerForm.controls['instanceType'].setValue(this.defaultInstance, {onlySelf: true});

        this.setDate();
        this.getJobs();

        this.getAllInstanceIds();

        let timer = Observable.timer(2000, 3000);
        this.jobRefreshTimerSubscription = timer.subscribe(t => {
            this.getJobs();
        });
    }

    ngOnDestroy() {
        this.jobRefreshTimerSubscription.unsubscribe();
    }

    setDate(): void {
        let date = new Date();
        this.schedulerForm.patchValue({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        });
    }

    resetForm() {
        var dateNow = new Date();
        this.schedulerForm.patchValue({
            jobName: "",
            year: dateNow.getFullYear(),
            month: dateNow.getMonth() + 1,
            day: dateNow.getDate(),
            hour: dateNow.getHours(),
            minute: dateNow.getMinutes()
        });
        this.jobNameStatus = "";
    }

    getJobs() {
        this._schedulerService.getJobs().subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS) {
                    this.jobRecords = success.data;
                } else {
                    console.log("Some error while fetching jobs");
                }

                /*
                let dateToShow = new Date(success.scheduleTime);
                this.jobRecords.scheduleTime = this.getFormattedDate(dateToShow.getFullYear(),
                  dateToShow.getMonth(),dateToShow.getHours(), dateToShow.getHours(),
                  dateToShow.getMinutes());
                */
            },
            err => {
                console.log("Error while getting all jobs");
            });
    }

    getFormattedDate(year, month, day, hour, minute) {
        return year + "/" + month + "/" + day + " " + hour + ":" + minute;
    }

    checkJobExistWith(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.isJobWithNamePresent(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS) {
                    if (success.data == true) {
                        this.jobNameStatus = "Already Exist!";
                    } else {
                        this.jobNameStatus = "Available";
                    }
                } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
                    console.log("Job name is mandatory.");
                    this.schedulerForm.patchValue({
                        jobName: "",
                    });
                }
            },
            err => {
                console.log("Error while checkinh job with name exist.");
            });
        this.jobNameStatus = "";
    }

    scheduleJob() {
        var jobName = this.schedulerForm.value.jobName;
        var year = this.schedulerForm.value.year;
        var month = this.schedulerForm.value.month;
        var day = this.schedulerForm.value.day;
        var hour = this.schedulerForm.value.hour;
        var minute = this.schedulerForm.value.minute;
        var jobType = this.schedulerForm.value.jobType;
        var instanceId = this.schedulerForm.value.instanceId;

        var data = {
            "jobName": this.schedulerForm.value.jobName,
            "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
            "cronExpression": this.schedulerForm.value.cronExpression,
            "instanceId": this.schedulerForm.value.instanceId,
            "jobType": this.schedulerForm.value.jobType,
            "instanceType": this.schedulerForm.value.instanceType
        }

        this._schedulerService.scheduleJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS) {
                    console.log("Job scheduled successfully.");
                    this.resetForm();

                } else if (success.statusCode == ServerResponseCode.JOB_WITH_SAME_NAME_EXIST) {
                    console.log("Job with same name exists, Please choose different name.");

                } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
                    console.log("Job name is mandatory.");
                }
                this.jobRecords = success.data;
            },
            err => {
                console.log("Error while getting all jobs");
            });
    }

    updateJob() {
        var jobName = this.schedulerForm.value.jobName;
        var year = this.schedulerForm.value.year;
        var month = this.schedulerForm.value.month;
        var day = this.schedulerForm.value.day;
        var hour = this.schedulerForm.value.hour;
        var minute = this.schedulerForm.value.minute;

        var data = {
            "jobName": this.schedulerForm.value.jobName,
            "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
            "cronExpression": this.schedulerForm.value.cronExpression
        }

        this._schedulerService.updateJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS) {
                    console.log("Job updated successfully.");
                    this.resetForm();

                } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
                    console.log("Job no longer exist.");

                } else if (success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT) {
                    console.log("Please provide job name.");
                }
                this.jobRecords = success.data;
            },
            err => {
                console.log("Error while updating job");
            });
    }

    editJob(selectedJobRow) {
        this.isEditMode = true;

        var d = Date.parse(selectedJobRow.scheduleTime);
        let date = new Date(selectedJobRow.scheduleTime);
        this.schedulerForm.patchValue({
            jobName: selectedJobRow.jobName,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        });
    }

    cancelEdit() {
        this.resetForm();
        this.isEditMode = false;
    }

    pauseJob(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.pauseJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
                    console.log("Job paused successfully.")

                } else if (success.data == false) {
                    if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
                        console.log("Job already started/completed, so cannot be paused.");
                    }
                }
                this.getJobs();
            },
            err => {
                console.log("Error while pausing job");
            });

        //For updating fresh status of all jobs
        this.getJobs();
    }

    resumeJob(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.resumeJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
                    console.log("Job resumed successfully.")

                } else if (success.data == false) {
                    if (success.statusCode == ServerResponseCode.JOB_NOT_IN_PAUSED_STATE) {
                        console.log("Job is not in paused state, so cannot be resumed.");
                    }
                }

                //For updating fresh status of all jobs
                this.getJobs();
            },
            err => {
                console.log("Error while resuming job");
            });

        //For updating fresh status of all jobs
        this.getJobs();
    }

    stopJob(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.stopJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
                    console.log("Job stopped successfully.")

                } else if (success.data == false) {
                    if (success.statusCode == ServerResponseCode.JOB_NOT_IN_RUNNING_STATE) {
                        console.log("Job not started, so cannot be stopped.");

                    } else if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
                        console.log("Job already started.");

                    } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
                        console.log("Job no longer exist.");
                    }
                }

                //For updating fresh status of all jobs
                this.getJobs();
            },
            err => {
                console.log("Error while pausing job");
            });
    }

    startJobNow(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.startJobNow(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
                    console.log("Job started successfully.")

                } else if (success.data == false) {
                    if (success.statusCode == ServerResponseCode.ERROR) {
                        console.log("Server error while starting job.");

                    } else if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
                        console.log("Job is already started.");

                    } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
                        console.log("Job no longer exist.");
                    }
                }

                //For updating fresh status of all jobs
                this.getJobs();
            },
            err => {
                console.log("Error while starting job now.");
            });

        //For updating fresh status of all jobs
        this.getJobs();
    }

    deleteJob(jobName) {
        var data = {
            "jobName": jobName
        }
        this._schedulerService.deleteJob(data).subscribe(
            success => {
                if (success.statusCode == ServerResponseCode.SUCCESS && success.data == true) {
                    console.log("Job deleted successfully.");

                } else if (success.data == false) {
                    if (success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE) {
                        console.log("Job is already started/completed, so cannot be deleted.");

                    } else if (success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST) {
                        console.log("Job no longer exist.");
                    }
                }

                //For updating fresh status of all jobs
                this.getJobs();
            },
            err => {
                console.log("Error while deleting job");
            });
    }

    refreshJob() {
        //For updating fresh status of all jobs
        this.getJobs();
    }

    cronChange(cronExp) {
        this.schedulerForm.patchValue({
            cronExpression: cronExp
        });
    }

    jobTypeChange(jobType: any) {
        this.schedulerForm.controls['jobType'].setValue(jobType);
    }

    getAllInstanceIds() {
        this._schedulerService.getAllInstanceIds().subscribe(
            success => {
                // debugger;
                if (success.statusCode == ServerResponseCode.SUCCESS) {
                    this.instances = success.data;
                    this.onSelect("EC2");
                    this.schedulerForm.controls['instanceId'].setValue(success.data[0].instance_id, {onlySelf: true});

                } else {
                    console.log("Some error while fetching instance ids");
                }
            },
            err => {
                console.log("Error while getting all instance ids");
            });
    }

    onSelect(instanceType) {
        // debugger;
        this.filteredInstances = this.instances
            .filter((item) => item.instance_type == instanceType);
        this.schedulerForm.controls['instanceId'].setValue(this.filteredInstances[0].instance_id, {onlySelf: true});
        this.schedulerForm.value.instanceId = this.filteredInstances[0].instance_id;
    }

    timeZone(zone: any) {
        switch (zone) {
            case "IST":
                this.holidayList = this.staticDataTimeZone.IST;
                break;
            case "EST":
                this.holidayList = this.staticDataTimeZone.EST;
                break;
            case "GMT":
                this.holidayList = this.staticDataTimeZone.GMT;
                break;
            case "JST":
                this.holidayList = this.staticDataTimeZone.JST;
                break;


        }
    }


    holidaySelected(holiday: any) {
        const getDate = string => (([year, day, month]) => ({day, month, year}))(string.split('-'));
        let formattedDate = getDate(holiday);
        this.schedulerForm.controls['year'].setValue(formattedDate.year, {onlySelf: true});
        this.schedulerForm.controls['month'].setValue(formattedDate.month, {onlySelf: true});
        this.schedulerForm.controls['day'].setValue(formattedDate.day, {onlySelf: true});
    }

}


