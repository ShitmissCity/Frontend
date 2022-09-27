export function getUrl(url_segment: string, init: RequestInit = {}): Promise<Response> {
    var url = process.env.REACT_APP_REQUEST_URL + url_segment;

    return fetch(url, init);
}