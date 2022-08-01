import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from '../models/document';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  url: string = environment.apiUrl+'/api';

  constructor(private http: HttpClient) { }

   getDocuments(): Observable<Document[]>{
    return this.http.get<Document[]>(this.url+'/document');
  }

}
