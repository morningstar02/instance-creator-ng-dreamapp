import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  constructor(private http: HttpClient) { }

  createInstance(arn: string, region: string, keyName: string, instanceType: string, amiId: string, externalId: string, name: string) {
    return this.http.post<any>(environment.base_url + `users/createec2`, { arn, region, keyName, instanceType, amiId, externalId, name })
      .pipe(map(brand => brand));
  }

  listInstances(arn: string, region: string, externalId: string, instanceType: string) {
    return this.http.post<any>(environment.base_url + `users/listec2`, { arn, region, externalId, instanceType })
      .pipe(map(brand => brand));
  }

  runSSMCommand(arn: string, region: string, instanceId: string, externalId: string, command: string) {
    return this.http.post<any>(environment.base_url + `users/runssmCommand`, { arn, region, instanceId, externalId , command })
      .pipe(map(brand => brand));
  }
}
