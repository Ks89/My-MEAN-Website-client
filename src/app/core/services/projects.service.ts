import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export class ProjectHomeView {
  constructor(
    public _id: string,
    public carouselImagePath: string,
    public carouselText: string,
    public thumbImagePath: string,
    public thumbText: string,
    public bigThumbImagePath: string,
    public bigThumbText: string) {
  }
}

export class ProjectGallery {
  constructor(
    public _id: string,
    public thumb: string,
    public img: string,
    public description: string) {
  }
}

export class Author {
  constructor(
    public _id: string,
    public name: string,
    public surname: string,
    public url: string,
    public urlAvailable: boolean) {
  }
}


export class Project {
  constructor(
    public _id: string,
    public name: string,
    public url: string,
    public iconPath: string,
    public description: string,
    public shortDescription: string,
    public license: string,
    public licenseText: string,
    public visible: boolean,
    public projectHomeView: Array<ProjectHomeView>,
    public lastUpdate: string,
    public filePaths: Array<string>,
    public gallery: Array<ProjectGallery>,
    public futureExtensions: Array<string>,
    public features: Array<string>,
    public releases: Array<string>,
    public changelog: Array<string>,
    public tags: Array<string>,
    public authors: Array<Author>) {
  }
}

@Injectable()
export class ProjectService {
  constructor(private http: Http) {}

  getProjects(): Observable<Project[]> {
    return this.http.get('/api/projects')
      .map(response => response.json())
      .catch(this.handleError);
  }

  getProjectsById(projectid: string): Observable<Project> {
    return this.http.get(`/api/projects/${projectid}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return this.http.get('/api/projecthome')
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError (error: any) {
    // TODO In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(new Error(errMsg));
  }

}
