import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ItemIdType } from '../../../models/item-id-type';
import { MovieDetails } from '../../../models/movie-details';
import { TVSeriesDetails } from '../../../models/tvseries-details';
import { MovieReviewsService } from '../../../services/movie-reviews.service';
import { TmdbService } from '../../../services/tmdb.service';
import { TVseriesReviewsService } from '../../../services/tvseries-reviews.service';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StarRatingComponent } from '../../star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-item-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StarRatingComponent,
  ],
  templateUrl: './item-edit-dialog.component.html',
  styleUrl: './item-edit-dialog.component.css'
})
export class ItemEditDialogComponent implements OnInit {

  // Checks if data is loaded, if not displays loading spinner component
  loadingData: boolean = true;

  // For data and display
  movieDetails: MovieDetails;
  tvSeriesDetails: TVSeriesDetails;
  genreList: string = "";

  // For star highlight component input to display highlighted stars in review mode
  reviewRating: number = 0;

  reviewForm  = new FormGroup({
    movieId: new FormControl({value: 0, disabled: false}),
    tvSeriesId: new FormControl({value: 0, disabled: false}),
    rating: new FormControl({value: 0, disabled: false}, [Validators.required, Validators.pattern(/^-?(0|[1-5]\d*)?$/)]),
    review: new FormControl({value: "", disabled: false}, [Validators.required]),
  });

  constructor(
    private _dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemIdType,
    public dialog: MatDialog,
    private _tmdbService: TmdbService,
    private _movieReviewsService: MovieReviewsService,
    private _tvReviewsService: TVseriesReviewsService
  ) {}

  /** Get movie/tvseries details and review details to populate component */
  ngOnInit(): void {
    this._dialogRef.updateSize("1050px", "500px");
    switch(this.data.movieOrTvSeries) {
      case "MOVIES":
        this.getMovieDetails();
        if(this._movieReviewsService.getReview(this.data.id)) {
          this.setReviewDetails(this.data.id);
        }
        //disable id based on movieOrTvSeries
        this.reviewForm.controls['tvSeriesId'].disable();
        this.reviewForm.controls['movieId'].setValue(this.data.id);
        break;
      case "TVSERIES":
        this.getTvSeriesDetails();
        if(this._tvReviewsService.getReview(this.data.id)) {
          this.setReviewDetails(this.data.id);
        }
        // disable id based on movieOrTvSeries
        this.reviewForm.controls['movieId'].disable();
        this.reviewForm.controls['tvSeriesId'].setValue(this.data.id);
        break;
      default:
        console.log("Movie or Tvseries Error");
        break;
    }
  }

  /** Get Movie Details */
  getMovieDetails(): void {
    this._tmdbService.getMovieDetails(this.data.id)
    .subscribe(
      data => {
        // console.log(data);
        this.movieDetails = {...data};
        this.setMovieDetails();
        this.loadingData = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  /** Set Movie Details */
  setMovieDetails(): void {
    // Set Poster Path
    this.movieDetails.poster_path = `https://image.tmdb.org/t/p/original/` + this.movieDetails.poster_path;
    // Set Genre List
    for(let genreId of this.movieDetails.genres) {
      this.genreList += genreId.name + " ";
    }
  }

  /** Get TV Series Details */
  getTvSeriesDetails(): void {
    this._tmdbService.getTVSeriesDetails(this.data.id)
    .subscribe(
      data => {
      // console.log(data);
      this.tvSeriesDetails = {...data};
      this.setTvSeriesCardDetails();
      this.loadingData = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  /** Set TV Series Details */
  setTvSeriesCardDetails(): void {
    this.tvSeriesDetails.poster_path = `https://image.tmdb.org/t/p/original/` + this.tvSeriesDetails.poster_path;
    // Set Genre List
    for(let genreId of this.tvSeriesDetails.genres) {
      this.genreList += genreId.name + " ";
    }
  }

  /** Sets rating value from the star-rating component */
  setRating(rating: number): void {
    // for star highlight
    this.reviewRating = rating;
    // for form
    this.reviewForm.controls['rating'].setValue(rating);
  }

  /** Get review data and sets it */
  setReviewDetails(id:number): void {
    switch(this.data.movieOrTvSeries) {
      case "MOVIES":
        let currentMovieReview = this._movieReviewsService.getReview(id);
        // console.log(currentMovieReview);
        if (currentMovieReview != undefined) {
          this.setRating(currentMovieReview.rating);
          this.reviewForm.controls['review'].setValue(currentMovieReview.review);
        }
        break;
      case "TVSERIES":
        let currentTVSeriesReview = this._tvReviewsService.getReview(id);
        // console.log(currentTVSeriesReview);
        if(currentTVSeriesReview != undefined) {
          this.setRating(currentTVSeriesReview.rating);
          this.reviewForm.controls['review'].setValue(currentTVSeriesReview.review);
        }
        break;
      default:
        console.log("Movie or Tvseries Error");
        break;
    }
  }

  /** Submits review to database */
  onEditReview(): void {
    if (this.reviewForm.valid) {
      switch(this.data.movieOrTvSeries) {
        case "MOVIES":
          let newMovieRating = this.reviewForm.value.rating || 0;
          let newMovieReview = this.reviewForm.value.review || "";
          this._movieReviewsService.editReview(this.data.id, newMovieRating, newMovieReview);
          this._dialogRef.close();
          break;
        case "TVSERIES":
          let newTVSeriesRating = this.reviewForm.value.rating || 0;
          let newTVSeriesReview = this.reviewForm.value.review || "";
          this._tvReviewsService.editReview(this.data.id, newTVSeriesRating, newTVSeriesReview);
          this._dialogRef.close();
          break;
        default:
          console.log("Movie or Tvseries Error");
          break;
      }
    }
  }

  /** Delete Review */
  onDeleteReview(): void {
    switch(this.data.movieOrTvSeries) {
      case "MOVIES":
        this._movieReviewsService.deleteReview(this.data.id);
        this._dialogRef.close();
        break;
      case "TVSERIES":
        this._tvReviewsService.deleteReview(this.data.id);
        this._dialogRef.close();
        break;
      default:
        console.log("Movie or Tvseries Error");
        break;
    }
  }

  /** Closes Dialog */
  onCloseDialog(): void {
    this._dialogRef.close();
  }
}

