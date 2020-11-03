import { Component } from '@angular/core';
import { AwsService } from './_services/aws.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface instanceElement {
  instanceId: string;
  instanceType: string;
  PrivateIpAddress: string;
  PublicIpAddress: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-dream-app';
  showSpinner = false;
  instanceId = '';
  imageId = '';
  instanceType = '';
  keyName = '';
  launchTime = '';
  privateDnsName = '';
  instanceTableDataSource: instanceElement[];
  arn: string = 'arn:aws:iam::400525531427:role/react-node';
  displayedColumns: string[] = ['instanceId', 'instanceType', 'PrivateIpAddress', 'PublicIpAddress'];
  constructor(
    public awsService: AwsService, private _snackBar: MatSnackBar
  ) { 
    this.listInstances(this.arn)
   }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async createInstance(arn, event) {
    event.stopPropagation();
    this.showSpinner = true;
    console.log(arn);
    this.awsService.createInstance(arn).subscribe(
      data => {
        this.openSnackBar('Free-tier instance created', 'Ok');
        this.showSpinner = false;
        let instanceData = data['instanceData'];
        this.instanceId = instanceData.InstanceId;
        this.imageId = instanceData.ImageId;
        this.instanceType = instanceData.InstanceType;
        this.keyName = instanceData.KeyName;
        this.launchTime = instanceData.LaunchTime;
        this.privateDnsName = instanceData.PrivateDnsName;
        console.log(data)
      },
      error => {
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

  async listInstances(arn) {
    this.showSpinner = true;
    console.log(arn);
    this.awsService.listInstances(arn).subscribe(
      data => {
        console.log(data)
        this.showSpinner = false;
        let listData: [] = data.Reservations;
        let tableData: instanceElement[] = []; 
        listData.forEach(element => {
          //  [{instanceId: '0', instanceType: 'Hydrogen', PrivateIpAddress: '1.0.0.79', PublicIpAddress: '1.0.0.29'}];
            tableData.push({
              instanceId: element['Instances'][0]['InstanceId'],
              instanceType: element['Instances'][0]['InstanceType'],
              PrivateIpAddress: element['Instances'][0]['PrivateIpAddress'],
              PublicIpAddress: element['Instances'][0]['PublicIpAddress']})
        });
        this.instanceTableDataSource = tableData;


      },
      error => {
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

}
