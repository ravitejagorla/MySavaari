import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AutoComplete } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiService } from '../../../../core/services/api.service';

export interface Area {
    id: number;
    area_name: string;
    city_instance?: { city_name: string; };
    state_instance?: { state_name: string; };
    country_instance?: { country_name: string; };
    pin_code?: string;
    full_label?: string;
}

@Component({
    selector: 'ras-area-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule, AutoComplete, InputTextModule,],
    template: `
    <p-autocomplete class="w-full" [(ngModel)]="selectedArea" [suggestions]="areaList" (completeMethod)="filterArea($event)" (onSelect)="onAreaSelect($event)" 
        (onClear)="onAreaClear()" [showClear]="true" [forceSelection]="true" placeholder="Search for Area" optionLabel="full_label">
        <ng-template let-area pTemplate="item">
            <div>{{ area.area_name }} - {{ area.pin_code }}</div>
        </ng-template>
        <ng-template let-area pTemplate="selectedItem">
            {{ area.area_name }} - {{ area.pin_code }}
        </ng-template>
    </p-autocomplete>
  `,
})
export class AreaSearchInputComponent {
    private readonly api = inject(ApiService);
    private readonly areaSearch$ = new Subject<string>();

    @Input()
    set initialArea(value: Area | null) {
        if (!value) {
            this.selectedArea = null;
            this.areaList = [];
            return;
        }

        if (!value.area_name) {
            console.warn(
                'AreaSearchInputComponent received an invalid initialArea:',
                value,
            );

            this.selectedArea = null;
            this.areaList = [];
            return;
        }

        const areaWithLabel: Area = {
            ...value,
            full_label:
                value.full_label ??
                `${value.area_name} - ${value.pin_code ?? ''}`,
        };

        this.selectedArea = areaWithLabel;
        this.areaList = [areaWithLabel];
    }

    @Output()
    areaSelected = new EventEmitter<Area>();

    @Output()
    areaCleared = new EventEmitter<void>();

    selectedArea: Area | null = null;
    areaList: Area[] = [];

    constructor() {
        this.areaSearch$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((query) => {
                    if (!query) {
                        return of([] as Area[]);
                    }

                    const encodedQuery = encodeURIComponent(query);

                    return this.api
                        .get(`datamanagement/areas/?search=${encodedQuery}`, {})
                        .pipe(
                            catchError((error) => {
                                console.error('Error fetching areas:', error);
                                return of([] as Area[]);
                            }),
                        );
                }),
                takeUntilDestroyed(),
            )
            .subscribe((data: Area[]) => {
                this.areaList = data.map((area) => ({
                    ...area,
                    full_label: `${area.area_name} - ${area.pin_code ?? ''}`,
                }));
            });
    }

    filterArea(event: AutoCompleteCompleteEvent): void {
        const query = event.query?.trim() ?? '';

        this.areaSearch$.next(query);
    }

    onAreaSelect(event: { value: Area }): void {
        const selectedArea = event.value;

        if (!selectedArea) {
            return;
        }

        this.selectedArea = selectedArea;
        this.areaSelected.emit(selectedArea);
    }

    onAreaClear(): void {
        this.selectedArea = null;
        this.areaList = [];
        this.areaCleared.emit();
    }
}