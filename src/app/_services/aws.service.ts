import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  constructor(private http: HttpClient) { }

  createInstance(arn: string) {
    return this.http.post<any>(environment.base_url + `users/createec2`, { arn })
      .pipe(map(brand => brand));
  }

  listInstances(arn: string) {
    return this.http.post<any>(environment.base_url + `users/listec2`, { arn })
      .pipe(map(brand => brand));
  }
}
