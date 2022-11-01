import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { isEmpty, map, Observable, startWith } from 'rxjs';
import { puphaxTables } from '../model/tables';
import { PuphaxDataService } from '../puphax-data.service';


@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {
  tableSize:number;
  tables = puphaxTables;
  initPageSize= 10;
  page = 0;
  size = this.initPageSize;
  tableNamesFiltered: string[];
  tableNames:string[];
  tableValues:Array<Array<Object>>;
  table:string = puphaxTables[0];
  selectedColumn:string | null = null;
  searchValue! :string;
 

  constructor(private puphaxData:PuphaxDataService) {
    this.tableSize = 0;
    this.tableNames = [];
    this.tableValues = [];
    this.tableNamesFiltered = [];
  }

  ngOnInit(): void {
    this.showDataWithoutFilter();
  }

  pageChangeEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.showDataWithoutFilter();
  }


  checkSearchValues() {
    if(this.isEmpty(this.selectedColumn)) {
      alert("Nem adott meg keresési mezőt!");
      return;
    }

    if(this.isEmpty(this.searchValue)) {
      alert("Nem adott meg keresési értéket!");
      return;
    }  
  }

  showDataWithoutFilter() {
    console.log("Showing data! : table: " +  this.table);
    this.checkShowDataFields();
    this.clearTableData();
    this.downloadData(null, null);
  }

  showDataFiltered() {
    this.checkSearchValues();
    this.checkShowDataFields();
    this.tableValues = [];
    this.page = 0;
    this.downloadData(this.selectedColumn, this.searchValue);
  }

  checkShowDataFields() {
    if(this.page == null || this.size == null) {
      alert("Kérem adjon meg page és size-t!");
      return;
    }
    if(this.table == null) {
      alert("Kérem válasszon táblát!");
      return;
    }
  }

  searchField(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.tableNamesFiltered =  this.tableNames.filter(option => option.toLowerCase().startsWith(element.value.toLowerCase()));
  }

  searchTable(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.tables =  puphaxTables.filter(option => option.toLowerCase().startsWith(element.value.toLowerCase()));
  }

   
  downloadData(field:any, value:any) {
    if(this.table == null) {
      alert("Kérem válasszon táblát!");
      return;
    }

    this.puphaxData.getTotalPagable<Object>(this.page , this.size, this.table, field, value)
     .subscribe(data => {
      this.puphaxData.getTableSize(this.table, field, value).subscribe(data => this.tableSize = data);
      if(data[0] === undefined) {
        return;
      }
        this.tableNames = Object.keys(data[0]);
        data.forEach( (value) => {
          this.tableValues.push(Object.values(value));
        }); 
        this.tableNamesFiltered = this.tableNames;
     });
  }

  clearTableData() {
    this.tableNames = [];
    this.tableValues = [];
  }

  selectedTable(tableSelected: MatSelectChange) {
    console.log("Selected!");
    console.log(tableSelected);
    this.clearTableData();
    this.table = tableSelected.value;
    this.page = 0;
    this.size = this.initPageSize;
    this.showDataWithoutFilter();
  }

   isEmpty(data: string | null) : boolean {
    if(data == null) {
      return true;
    }

    return (typeof data === "string" && data.trim().length == 0);
  }

}
