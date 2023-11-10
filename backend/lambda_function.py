from http import HTTPStatus
import traceback

from AtBet import JSONResponse, RequestHandler


def lambda_handler(event, _context):
    try:
        response = RequestHandler.handle(event).to_lambda_response()
    except Exception as e:
        response = JSONResponse(
            HTTPStatus.INTERNAL_SERVER_ERROR,
            {"error": "unknown error occurred: " + str(e), "trace": traceback.format_exc()}
        ).to_lambda_response()
    return response
