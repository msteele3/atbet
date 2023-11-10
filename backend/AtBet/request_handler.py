from http import HTTPMethod, HTTPStatus
import pybaseball

from AtBet import JSONResponse


class RequestHandler:

    @staticmethod
    def handle(event) -> JSONResponse:
        method = event['httpMethod']
        endpoint = event['path']
        query_params = event['queryStringParameters']
        body = event['body']

        handlers = {
            "/teams": {
                HTTPMethod.GET: RequestHandler.list_teams
            }
        }

        endpoint_handlers = handlers.get(endpoint)
        if endpoint_handlers is None:
            return JSONResponse(
                HTTPStatus.NOT_FOUND,
                {"error": f"unknown endpoint '{endpoint}'"}
            )

        handler = endpoint_handlers.get(method)
        if handler is None:
            return JSONResponse(
                HTTPStatus.METHOD_NOT_ALLOWED,
                {"error": f"method not supported for endpoint '{endpoint}'"}
            )

        return handler(query_params, body)

    @staticmethod
    def list_teams(query_params, body) -> JSONResponse:
        teams_by_division = pybaseball.standings()
        all_teams = []
        for division in teams_by_division:
            all_teams += division['Tm'].values.tolist()
        all_teams.sort()

        return JSONResponse(HTTPStatus.OK, {"teams": all_teams})
