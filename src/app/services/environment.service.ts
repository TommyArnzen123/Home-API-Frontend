import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IEnvironment } from "../model/environment.interface";

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    getEnvironment(): IEnvironment {
        // if (this.isLocalhost(window.location.hostname)) {
            const environment: IEnvironment = {
                backendUrl: "http://localhost:8080",
            }
            
            return environment;
        // }
    }

    isLocalhost(url: string) {
        return url === 'localhost';
    }

}