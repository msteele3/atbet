from http import HTTPMethod, HTTPStatus
from pybaseball.standings import standings
from pybaseball.utils import most_recent_season
from pybaseball import cache
import traceback
import urllib.parse

from AtBet import JSONResponse, Stats

cache.enable()


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
            },
            "/stats": {
                HTTPMethod.GET: RequestHandler.get_stats
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
        all_teams = []
        try:
            for division in standings():
                all_teams += division['Tm'].values.tolist()
        except Exception as e:
            return JSONResponse(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": "list_teams: failed to load list of teams from standings: " + str(e),
                "trace": traceback.format_exc(),
            })
        all_teams.sort()
        return JSONResponse(HTTPStatus.OK, {"teams": all_teams})

    @staticmethod
    def get_stats(query_params, body) -> JSONResponse:
        if not query_params or 'team1' not in query_params or not query_params['team1']:
            return JSONResponse(HTTPStatus.BAD_REQUEST, {"error": "Missing required parameter 'team1'"})
        team1 = urllib.parse.unquote(query_params['team1'])
        if 'team2' not in query_params or not query_params['team2']:
            return JSONResponse(HTTPStatus.BAD_REQUEST, {"error": "Missing required parameter 'team2'"})
        team2 = urllib.parse.unquote(query_params['team2'])

        # from datetime import datetime

        # tm1 = datetime.now().timestamp()
        the_most_recent_season = most_recent_season()
        # tm2 = datetime.now().timestamp()
        # el2 = tm2 - tm1
        the_standings = standings()
        # tm3 = datetime.now().timestamp()
        # el3 = tm3 - tm2
        # team abbreviations
        try:
            team_abbrevs = Stats.get_teams_and_abbreviations(the_most_recent_season)
        except Exception as e:
            return JSONResponse(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": "get_stats: failed to load team_abbrevs: " + str(e),
                "trace": traceback.format_exc(),
            })
        # tm4 = datetime.now().timestamp()
        # el4 = tm4 - tm3

        # W-L %
        try:
            team1_wl, team2_wl = Stats.get_teams_wl_from_standings(the_standings, team1, team2)
        except Exception as e:
            return JSONResponse(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": "get_stats: failed to load team w-l: " + str(e),
                "trace": traceback.format_exc(),
            })
        # tm5 = datetime.now().timestamp()
        # el5 = tm5 - tm4
        
        # BA & OBP
        try:
            team1_batting = Stats.get_team_batting_totals(team_abbrevs[team1], the_most_recent_season)
            team2_batting = Stats.get_team_batting_totals(team_abbrevs[team2], the_most_recent_season)
            team1_ba = team1_batting["BA"]
            team1_obp = team1_batting["OBP"]
            team2_ba = team2_batting["BA"]
            team2_obp = team2_batting["OBP"]
        except Exception as e:
            return JSONResponse(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": "get_stats: failed to load team ba / obp: " + str(e),
                "trace": traceback.format_exc(),
            })

        # tm6 = datetime.now().timestamp()
        # el6 = tm6 - tm5

        # ERA & WHIP
        try:
            team1_pitching = Stats.get_team_pitching_totals(team_abbrevs[team1], the_most_recent_season)
            team2_pitching = Stats.get_team_pitching_totals(team_abbrevs[team2], the_most_recent_season)
            team1_era = team1_pitching["ERA"]
            team1_whip = team1_pitching["WHIP"]
            team2_era = team2_pitching["ERA"]
            team2_whip = team2_pitching["WHIP"]
        except Exception as e:
            return JSONResponse(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": "get_stats: failed to load team ba / obp: " + str(e),
                "trace": traceback.format_exc(),
            })
        # tm7 = datetime.now().timestamp()
        # el7 = tm7 - tm6

        return JSONResponse(HTTPStatus.OK, {
            'stats': {
                'abbrev': (team_abbrevs[team1], team_abbrevs[team2]),
                'odds': ("-152", "+126"),  # odds are not available in the off-season for obvious reasons
                'wl': (team1_wl, team2_wl),
                'ba': (team1_ba, team2_ba),
                'obp': (team1_obp, team2_obp),
                'era': (team1_era, team2_era),
                'whip': (team1_whip, team2_whip),
            }
            # 'perf': [el4, el5, el6, el7],
        })

