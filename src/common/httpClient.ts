import * as http from "axios";
import * as _ from "lodash";

class httpClient {

    public static GET(options: any) {
        return new Promise<{ err: any, response: any }>((resolve, reject) => {
            if (this.__checkValidOptions(options)) {
                http.default(options)
                    .then((response) => {
                        console.info("Made GET Call for URL " + options.url + " status code " + response.status)
                        return resolve({ err: null, response: response });
                    })
                    .catch((err) => {
                        console.error("Made Call for URL " + options.url + " Err " + err && err.message)
                        return resolve({ err: err, response: null });
                    })
            } else {
                return resolve({ err: new Error("Not a valid options for API call"), response: null });
            }
        })
    }

    public static POST(options: any) {
        return new Promise<any>((resolve, reject) => {
            if (this.__checkValidOptions(options)) {
                http.default(options)
                    .then((response) => {
                        console.info("Made POST Call for URL " + options.url + " status code " + response.status)
                        return resolve(response);
                    })
                    .catch((err) => {
                        console.error("Made Call for URL " + options.url + " Err " + err && err.message)
                        return reject(err);
                    })
            } else {
                return resolve({ err: new Error("Not a valid options for API call"), response: null });
            }
        })
    }

    private static __checkValidOptions(options: any): boolean {
        if (!options || !Object.keys(options).length || !options.url) {
            return false;
        }
        this.__setDefaultOptions(options);
        return true;
    }

    private static __setDefaultOptions(options: any): void {
        if (!options.method) {
            _.set(options, 'method', 'GET'); // default method is set to 'GET'
        }
        if (!options.timeout)
            _.set(options, 'timeout', 1500); //default APIs timeout to be set 1.5 secs.

    }
}

export { httpClient };