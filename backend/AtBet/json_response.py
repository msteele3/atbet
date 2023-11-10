from http import HTTPStatus
import json


class JSONResponse:

    def __init__(self, code: HTTPStatus, payload: dict[str]) -> None:
        self.code: HTTPStatus = code
        self.payload: dict = payload

    def to_lambda_response(self) -> dict[str]:
        return {
            'statusCode': self.code,
            'isBase64Encoded': False,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': json.dumps(self.payload),
        }
