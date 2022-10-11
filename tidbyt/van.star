load("render.star", "render")
load("http.star", "http")
load("encoding/base64.star", "base64")

ICON_BOLT = base64.decode("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACqADAAQAAAABAAAACgAAAAA7eLj1AAAAt0lEQVQYGW1PsQ4BQRSc5QqR3C9IVLQkvsC1Eo1W4xdUCj+jJz5ANBSOE/+g0YhColGMWWezi3vJ7Mx7M9m3CxQU92jwgHlolcLGam4Qw2ABIgu9ryCpSAUzBZpSlotL66YChfVvwrgBM/S0bqnezu7C7e0RA9NB6lcTExln4SLEQk3Y2pD4v/Tj0Wf9SVx1iciJgIfSV5TRNy08grmX3KGuW548ouunufJvtH2EROfYtLHKbX++AGunNaO1+wwFAAAAAElFTkSuQmCC")
ICON_DROP = base64.decode("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACqADAAQAAAABAAAACgAAAAA7eLj1AAAAqUlEQVQYGWNgQAfF/2czgDAaYEThF/8PAfJXQ8VCGXoZ18DkEQrL/vMy/GW4DZQQh0q+ZGBmUGXoYvwM4jNBBRkY/jBUAtkwRSBhcagYWAnERIhpz4Ei3GBRBPEVaKokyFSIiX8ZnLEoAinnBjoHJAe3WhnEwQHAcjA3XsOhCCQMloMo/M5wGChwC4viWwwQOajV0xi/AFn2DP8ZlgEVPwZjEBskBpIDAgD1gCmaPBKB+wAAAABJRU5ErkJggg==")

HOME_ASSISTANT_URL = ""
HOME_ASSISTANT_ACCESS_TOKEN = ""

def get_state(entity_id):
    url =  "%s/api/states/%s" % (HOME_ASSISTANT_URL, entity_id)
    headers = {
      "Authorization": "Bearer %s" % HOME_ASSISTANT_ACCESS_TOKEN,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }

    return http.get(url, headers=headers).json()["state"]

def main():
    soc = get_state("sensor.state_of_charge")
    fresh = get_state("sensor.fresh_water_tank_level")

    return render.Root(
        render.Column(
            children=[
                render.Box(height = 4),
                render.Box(
                    child = render.Row(
                        cross_align="center",
                        children = [
                            render.Image(src=ICON_BOLT),
                            render.Text("%s%%" % soc),
                        ],
                    ),
                    height = 10
                ),
                render.Box(height = 4),
                render.Box(
                    child = render.Row(
                        cross_align="center",
                        children = [
                            render.Image(src=ICON_DROP),
                            render.Text("%s%%" % fresh),
                        ],
                    ),
                    height = 10
                ),

            ]
        )
    )
