import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormGroup, FormControl } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  channel = new FormGroup({
    selectedChannel: new FormControl(),
  });

  responseData:any

  constructor(private http: HttpClient){}

  ngOnInit() {
    //this.getData();
  }

  onDateChangeStart($event: any) {
    this.range.get('start')?.setValue($event.value);
    console.log(this.range.get('start'));
  }

  ondatechangeEnd($event: any) {
    this.range.get('end')?.setValue($event.value);
    console.log(this.range.get('end'));
  }

  @ViewChild('canvas')
  canvas!: ElementRef;


  aplicarFiltro(){
    const url = 'http://localhost/server/monitoreo/getMonitoreoSomos.php';

    const body = {
      startDate: this.range.get('start')?.value,
      endDate: this.range.get('end')?.value,
      canalComunicacion: 'whatsapp'
    }

    this.http.post(url,body).subscribe((response:any) => {
      this.responseData = response;

      let labels: any[] = [];
      let data: any[] = [];

      this.responseData.respuesta1.forEach(function(item: any){
        labels.push(item._id);
        data.push(item.count);
      });

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Accesos al menú',
            data: data,
            backgroundColor: 'lightGreen',
            borderColor: 'darkGreen',
            borderWidth: 1
          }
        ]
      };

      const chart = new Chart(this.canvas.nativeElement, {
        type: "bar",
        data: chartData,
        options: {}
      });
    })
  }
}

