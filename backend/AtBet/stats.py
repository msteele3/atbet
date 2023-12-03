from bs4 import BeautifulSoup, SoupStrainer
from pandas import DataFrame
from pybaseball.team_batting import session
import json
team_totals_cache_filepath = "/tmp/get_team_totals_cache.json"


class Stats:
    @staticmethod
    def get_teams_and_abbreviations(season: int) -> dict[str, str]:
        cached_mapping = {}
        mapping: dict[str, str] = {}
        cache_filepath = "/tmp/get_teams_and_abbreviations_cache.json"
        with open(cache_filepath, "a+") as cache_file:
            cache_file.seek(0)
            try:
                cached_mapping = json.load(cache_file)
            except json.JSONDecodeError:
                pass

        if not cached_mapping:
            # soup = get_soup(season)
            url = f'http://www.baseball-reference.com/leagues/MLB/{season}-standings.shtml'
            s = session.get(url).text
            soup = BeautifulSoup(s, "lxml", parse_only=SoupStrainer('table'))
            tables = soup.find_all('table')
            for table in tables:
                for row in table.find('tbody').find_all('tr'):
                    team_name = row.find_all('a')[0].text.strip()
                    url = row.find_all('a')[0]['href'].strip()
                    team_abbrev = url.split("/teams/")[1].split(f"/{season}")[0].strip()
                    if str(season) not in cached_mapping:
                        cached_mapping[str(season)] = {}
                    cached_mapping[str(season)][team_name] = team_abbrev

        with open(cache_filepath, "w") as cache_file:
            json.dump(cached_mapping, cache_file)

        mapping = cached_mapping[str(season)]
        return mapping

    @staticmethod
    def get_teams_wl_from_standings(the_standings: list[DataFrame], team1: str, team2: str) -> (str, str):
        team1_wl = ""
        team2_wl = ""
        for division in the_standings:
            team1_search = division.loc[division['Tm'] == team1, 'W-L%']
            if not team1_search.empty:
                team1_wl = team1_search.values[0]
            team2_search = division.loc[division['Tm'] == team2, 'W-L%']
            if not team2_search.empty:
                team2_wl = team2_search.values[0]
            if team1_wl and team2_wl:
                break
        return team1_wl, team2_wl

    @staticmethod
    def _populate_team_totals_cache(cached_totals: dict, team_abbrev: str, season: int) -> dict:
        url = f"https://www.baseball-reference.com/teams/{team_abbrev}/{season}.shtml"
        response = session.get(url)
        soup = BeautifulSoup(response.text, 'lxml', parse_only=SoupStrainer('table'))

        for flavor in ["batting", "pitching"]:
            table = soup.find_all('table', {'id': f"team_{flavor}"})[0]
            header = table.find_all('thead')[0]
            header_row = header.find_all('tr')[0]
            upper_bound = 28 if flavor == "batting" else 34
            headings = [th.text.strip() for th in header_row.find_all('th')[1:upper_bound]]
            footer = table.find_all('tfoot')[-1]
            footer_row = footer.find_all('tr')[0]
            team_totals = [td.text.strip() for td in footer_row.find_all('td')[0:upper_bound-1]]

            totals = dict(zip(headings, team_totals))

            if team_abbrev not in cached_totals:
                cached_totals[team_abbrev] = {}

            if str(season) not in cached_totals[team_abbrev]:
                cached_totals[team_abbrev][str(season)] = {}

            cached_totals[team_abbrev][str(season)][flavor] = totals

        with open(team_totals_cache_filepath, "w") as cache_file:
            json.dump(cached_totals, cache_file)

        return cached_totals

    @staticmethod
    def get_team_batting_totals(team_abbrev: str, season: int) -> dict[str, str]:
        cached_totals = {}
        totals: dict[str, str] = {}

        with open(team_totals_cache_filepath, "a+") as cache_file:
            cache_file.seek(0)
            try:
                cached_totals = json.load(cache_file)
            except json.JSONDecodeError:
                pass
        if not cached_totals or team_abbrev not in cached_totals or str(season) not in cached_totals[team_abbrev]:
            cached_totals = Stats._populate_team_totals_cache(cached_totals, team_abbrev, season)

        totals = cached_totals[team_abbrev][str(season)]["batting"]
        return totals

    @staticmethod
    def get_team_pitching_totals(team_abbrev: str, season: int) -> dict[str, str]:
        cached_totals = {}
        totals: dict[str, str] = {}

        with open(team_totals_cache_filepath, "a+") as cache_file:
            cache_file.seek(0)
            cached_totals = {}
            try:
                cached_totals = json.load(cache_file)
            except json.JSONDecodeError:
                pass
        if not cached_totals or team_abbrev not in cached_totals or str(season) not in cached_totals[team_abbrev]:
            cached_totals = Stats._populate_team_totals_cache(cached_totals, team_abbrev, season)

        totals = cached_totals[team_abbrev][str(season)]["pitching"]
        return totals