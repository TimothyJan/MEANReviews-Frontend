import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { MovieDetails } from '../models/movie-details';
import { DataList, DataListWithDates } from '../models/data-list';
import { TvSeriesDetails } from '../models/tvseries-details';

const APIMOVIEROOT = "https://api.themoviedb.org/3/movie/";
const APITVSERIESROOT = "https://api.themoviedb.org/3/tv/";

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  constructor(private http: HttpClient) { }

  /** Get Movie Details */
  getMovieDetails(movieID:number): Observable<MovieDetails> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };

    return this.http.get<MovieDetails>(APIMOVIEROOT+movieID+'?language=en-US', options);
  }

  /** Get Popular Movie list */
  getMoviesList_Popular(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };

    return this.http.get<DataList>(APIMOVIEROOT + 'popular?language=en-US&page=1', options);
  }

  /** Get Now Playing Movie list */
  getMoviesList_NowPlaying(): Observable<DataListWithDates> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };

    return this.http.get<DataListWithDates>(APIMOVIEROOT + 'now_playing?language=en-US&page=1', options);
  }

  /** Get Upcoming Movie list */
  getMoviesList_Upcoming(): Observable<DataListWithDates> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };

    return this.http.get<DataListWithDates>(APIMOVIEROOT + 'upcoming?language=en-US&page=1', options);
  }

  /** Get Top Rated Movie list */
  getMoviesList_TopRated(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<DataList>(APIMOVIEROOT + 'top_rated?language=en-US&page=1', options);
  }

  /** Get TV Series Details */
  getTVSeriesDetails(series_id: number, season_number: string, episode_number: string): Observable<TvSeriesDetails> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<TvSeriesDetails>(APITVSERIESROOT + series_id + '/season/' + season_number + '/episode/' + episode_number + '?language=en-US', options)
  }

  /** Get Popular TV Series list */
  getTVSeriesList_Popular(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<DataList>(APITVSERIESROOT + 'popular?language=en-US&page=1', options);
  }

  /** Get Airing Today TV Series list */
  getTVSeriesList_AiringToday(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<DataList>(APITVSERIESROOT + '/airing_today?language=en-US&page=1', options);
  }

  /** Get On TV TV Series list */
  getTVSeriesList_OnTV(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<DataList>(APITVSERIESROOT + 'on_the_air?language=en-US&page=1', options);
  }

  /** Get Top Rated TV Series list */
  getTVSeriesList_TopRated(): Observable<DataList> {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: environment.authorizationHeader
      }
    };
    return this.http.get<DataList>(APITVSERIESROOT + 'top_rated?language=en-US&page=1', options);
  }

}
