import { Component } from '@angular/core';
import { AwsService } from './_services/aws.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

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
  arn: string = 'arn:aws:iam::400525531427:role/react-node';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor(
    public awsService: AwsService,
  ) {  }
  
  async createInstance(arn, event) {
    event.stopPropagation();
    this.showSpinner = true;
    console.log(arn);
    this.awsService.createInstance(arn).subscribe(
      data => {
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

  async listInstances(arn, event) {
    event.stopPropagation();
    this.showSpinner = true;
    console.log(arn);
    this.awsService.listInstances(arn).subscribe(
      data => {
        this.showSpinner = false;
        console.log(data)
      },
      error => {
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

}
