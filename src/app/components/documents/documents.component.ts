import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Currency } from 'src/app/models/currency';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  currencies: Currency[] = [];
  documents: Document[] = [];
  allDocuments: Document[] = [];
  form!: FormGroup;
  hoveredDate: NgbDate | null = null;

  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;

  model!: NgbDateStruct;
  date!: {year: number, month: number};

  constructor(private fb: FormBuilder,
              private currencyService: CurrencyService,
              private documentService: DocumentService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              ) { }

  ngOnInit(): void {

    this.currencyService.getCurrencies()
      .subscribe(res => this.currencies = res);

    this.documentService.getDocuments()
      .subscribe(res => this.allDocuments = res);

    this.form = this.fb.group({
        documentNumber: [''],
        currencyCode: [''],
        dpFromDate: [''],
        dpToDate: ['']
    });

  }


  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSearch(): void {
    let ngbDocDate!: NgbDate | null;
    this.documents = this.allDocuments.filter(val => {
      const parsed = this.formatter.parse(val.documentDate);
      ngbDocDate = parsed && NgbDate.from(parsed);
      return (this.form.value.documentNumber ?  this.form.value.documentNumber == val.documentNumber : true)
        && (this.form.value.currencyCode ?  this.form.value.currencyCode == val.currencyCode : true)
        && (this.fromDate ? ngbDocDate && this.isRange(ngbDocDate) : true);
     });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  compararCurrency(c1: Currency, c2: Currency): boolean {
    if (c1 === undefined && c2 === undefined) return true;
    return c1 === null || c2 === null || c1 === undefined || c2 === undefined ? false : c1.currencyId == c2.currencyId;
  }
}
