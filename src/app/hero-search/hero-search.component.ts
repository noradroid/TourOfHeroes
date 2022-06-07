import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, // stale time where the component won't pick up the search term
  distinctUntilChanged, // ignore the text in the search if it is same as before
  switchMap // when the term changes, switch to a new search observable
            // preserves request order and only returns the observable 
            // from the most recent HTTP request that is sent
            // so previous calls(?) are discarded
            // (prevent receiving response for search terms half-typed)
} from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();
  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300 ms
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
