import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
  // getHeroes(): Observable<Hero[]> {
  //   // const heroes = of(HEROES);
  //   const heroes = this.http.get<Hero[]>(this.heroesUrl);
  //   this.log('fetched heroes');
  //   return heroes;
  // }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // getHero(id: number): Observable<Hero> {
  //   const heroes = of(HEROES);
  //   const hero = HEROES.find((h) => h.id === id);
  //   this.log(`fetched hero ${id}`);
  //   return of(hero!);
  // }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added new hero ${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero name=${hero.name}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero ${hero.id}`)),
      catchError(this.handleError<any>(`updated hero ${hero.id}`))
    );
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero ${id}`)),
      catchError(this.handleError<any>(`deleted hero ${id}`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`${x.length} heroes found`)
          : this.log(`no heroes found`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed
   * @param operation - name of operation
   * @param result - optional value to return as the observable result
   */
  // we should pass the result that we want returned from the service object
  // when there is an error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // returning empty result
      return of(result as T);
    };
  }
}
