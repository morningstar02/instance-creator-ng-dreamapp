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
  inputKeyName = 'react-node';
  inputInstanceType = 't2.micro';
  inputAmiId = 'ami-0947d2ba12ee1ff75';
  externalId = 'react-node';
  instanceName = '007';
  //keyName, instanceType, amiId, externalId, instanceName
  launchTime = '';
  privateDnsName = '';
  ssmCommand = 'ls -a';
  standardOutput = '';
  instanceTableDataSource: instanceElement[];
  arn: string = 'arn:aws:iam::400525531427:role/react-node';
  region: string = 'us-east-1';
  displayedColumns: string[] = ['instanceId', 'instanceType', 'PrivateIpAddress', 'PublicIpAddress', 'ssmCommand'];
  constructor(
    public awsService: AwsService, private _snackBar: MatSnackBar
  ) { 
    this.listInstances(this.arn)
   }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 20000,
    });
  }
//keyName, instanceType, amiId, externalId, instanceName
  async createInstance(arn, event) {
    event.stopPropagation();
    this.showSpinner = true;
    console.log(arn);
    this.awsService.createInstance(arn, this.region, this.inputKeyName, this.inputInstanceType, 
      this.inputAmiId, this.externalId, this.instanceName).subscribe(
      data => {
        this.openSnackBar('🚀 Instance created', 'Ok');
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
        this.openSnackBar(JSON.stringify(error) , 'Ok');
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

  async listInstances(arn) {
    this.showSpinner = true;
    console.log(arn);
    this.awsService.listInstances(arn, this.region, this.externalId, this.inputInstanceType).subscribe(
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
        this.openSnackBar(JSON.stringify(error) , 'Ok');
      }
    );
  }

  async runSSMCommand(arn, instanceId, command) {
    this.showSpinner = true;
    console.log(arn);
    this.awsService.runSSMCommand(arn, this.region, instanceId ,this.externalId, command).subscribe(
      data => {
        console.log(data)
        this.showSpinner = false;
        if(data.Status == 'Success') {
          this.standardOutput = data.StandardOutputContent;
        } else {
          this.standardOutput = data.StandardErrorContent;
        }

      },
      error => {
        this.showSpinner = false;
        console.log(error);
        this.openSnackBar(JSON.stringify(error) , 'Ok');
      }
    );
  }

}
