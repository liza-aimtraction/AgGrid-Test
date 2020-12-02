import { environment } from './../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { VideoService } from './video.service';
import { mockResponse } from '../testing-mock.spec';

describe('VideoService', () => {
  let service: VideoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VideoService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(VideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('#getVideoList: should return the list of videos', () => {
    service.getVideoList().subscribe(list => {
      expect(list.length).toEqual(2);
      expect(list[0]).toEqual(mockResponse.items[0]);
    });
    const req = httpTestingController.expectOne(
      environment.youtubeUrl
    );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
