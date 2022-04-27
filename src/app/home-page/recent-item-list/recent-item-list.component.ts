import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';

import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import {  Router } from '@angular/router';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SearchService } from '../../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { DefaultAppConfig } from '../../../config/default-app-config';
import {
  toDSpaceObjectListRD
} from '../../core/shared/operators';
import {
  Observable
  } from 'rxjs';
@Component({
  selector: 'ds-recent-item-list',
  templateUrl: './recent-item-list.component.html',
  styleUrls: ['./recent-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class RecentItemListComponent implements OnInit {

 
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
   paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;

  constructor(private router: Router,
    private searchService: SearchService,
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'rs';
    this.paginationConfig.maxSize = 0;

   
   this.paginationConfig.pageSize =new DefaultAppConfig().rpp; 
   this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {

    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        sort: this.sortConfig,
        dsoTypes: [DSpaceObjectType.ITEM]
      })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;


  }
  ngOnDestroy(): void {

  }




}
