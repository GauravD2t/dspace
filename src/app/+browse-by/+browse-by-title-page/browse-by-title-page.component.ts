
import {combineLatest as observableCombineLatest,  Observable ,  Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { Item } from '../../core/shared/item.model';
import { ActivatedRoute, PRIMARY_OUTLET, UrlSegmentGroup } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import { Collection } from '../../core/shared/collection.model';
import { browseParamsToOptions } from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['./browse-by-title-page.component.scss'],
  templateUrl: './browse-by-title-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitlePageComponent implements OnInit {

  /**
   * The list of items to display
   */
  items$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The pagination configuration to use for displaying the list of items
   */
  paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'browse-by-title-pagination',
    currentPage: 1,
    pageSize: 20
  });

  /**
   * The sorting configuration to use for displaying the list of items
   * Sorted by title (Ascending by default)
   */
  sortConfig: SortOptions = new SortOptions('dc.title', SortDirection.ASC);

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  public constructor(private itemDataService: ItemDataService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams, ) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          this.updatePage(browseParamsToOptions(params, this.paginationConfig, this.sortConfig));
        }));
  }

  /**
   * Updates the current page with searchOptions
   * @param searchOptions   Options to narrow down your search:
   *                        { pagination: PaginationComponentOptions,
   *                          sort: SortOptions }
   */
  updatePage(searchOptions: BrowseEntrySearchOptions) {
    this.items$ = this.itemDataService.findAll({
      currentPage: searchOptions.pagination.currentPage,
      elementsPerPage: searchOptions.pagination.pageSize,
      sort: searchOptions.sort,
      scopeID: searchOptions.scope
    });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
