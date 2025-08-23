import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvironmentService } from "./environment.service";
import { ILoginRequest, ILoginResponse } from "../model/login.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private readonly httpClient: HttpClient,
        private readonly environmentService: EnvironmentService
    ) {}

    private loginUrl = '/login';

    login(loginRequest: ILoginRequest): Observable<ILoginResponse> {
        return this.httpClient.post<ILoginResponse>(this.environmentService.getEnvironment().backendUrl + this.loginUrl, loginRequest);
    }

}