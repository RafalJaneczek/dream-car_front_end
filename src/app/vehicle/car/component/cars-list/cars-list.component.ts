import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Car} from '../../model/car';
import {CarService} from '../../service/car.service';
import {Router} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap/modal';
import {RemoveVehicleModalComponent} from '../delete-car-modal/remove-vehicle-modal.component';

@Component({
  selector: 'cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CarsListComponent implements OnInit {

  cars: Car[];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'mark';
  sortDirection: string = 'DESC';
  lastPage: number;
  requestInProgress: boolean;

  constructor(private carsService: CarService,
              private modalService: BsModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadCars(this.currentPage - 1, this.pageSize, this.sortBy);
  }

  public openRemoveCarModal(car: Car, event: Event): void {
    event.stopPropagation();
    const initialState = {
      vehicle: car
    };

    this.modalService.show(RemoveVehicleModalComponent, {
      initialState,
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered'
    });
  }

  public removeCar(car: Car, event: Event) {
    event.stopPropagation();
    this.carsService.remove(car.id).subscribe(() => {
      this.loadCars(this.currentPage, this.pageSize, this.sortBy);
    })
  }

  public goToCarDetails(car: Car) {
    this.router.navigate(['/car-form/edit', car.id]);
  }

  public loadCars(pageNo: number, pageSize: number, sortBy: string): void {
    this.requestInProgress = true;
    this.carsService.findAll(pageNo, pageSize, sortBy).subscribe((pageResponse) => {
      this.cars = pageResponse.vehicles;
      this.totalPages = pageResponse.totalPages;
      this.lastPage = pageResponse.totalPages;
      this.requestInProgress = false;
    });
  }

  public loadCarsList(pageNo: number, pageSize: number, sortBy: string): void {
    this.currentPage = pageNo;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.loadCars(this.currentPage - 1, this.pageSize, this.sortBy);
  }

  public changeCarsListSize(): void {
    this.loadCarsList(1, this.pageSize, this.sortBy);
  }

  public sortByMark(): void {

  }

}
