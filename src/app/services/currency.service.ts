import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from '../models/currency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  url: string = environment.apiUrl+'/api';

  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<Currency[]>{
    return this.http.get<Currency[]>(this.url+'/currency');
  }

}
