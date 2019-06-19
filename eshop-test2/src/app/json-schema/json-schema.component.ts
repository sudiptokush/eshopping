import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-schema',
  templateUrl: './json-schema.component.html',
  styleUrls: ['./json-schema.component.scss']
})
export class JsonSchemaComponent implements OnInit {
  yourJsonSchema: any = {}
  constructor() { }

  ngOnInit() {
    this.yourJsonSchema = {
      "first_name": "George",
      "last_name": "Washington",
      "birthday": "1732-02-22",
      "address": {
        "street_address": "3200 Mount Vernon Memorial Highway",
        "city": "Mount Vernon",
        "state": "Virginia",
        "country": "United States"
      }
    }
  }
}
