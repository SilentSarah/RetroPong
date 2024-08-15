import requests

class WebOps:
    @staticmethod
    def request_endpoint(url: str, method: str, headers: dict, data: dict = {}, json: dict = None) -> requests.Response:
        """Creates a request to an endpoint

        Args:
            url (str): endpoint url
            method (str): HTTP methods (GET, POST)
            headers (dict): Dictionary containing additional headers
            data (dict): Dictionary containing data to be sent

        Returns:
            requests.Response: Response object, returned by the endpoint
        """
        request = requests.Session()
        for key, value in headers.items():
            request.headers[key] = value
        request.headers = headers
        if method == "GET":
            response = request.get(url)
        elif method == "POST":
            if (json is None):
                response = request.post(url, data=data, verify=False)
            else:
                response = request.post(url, json=json, verify=False)
        return response
    