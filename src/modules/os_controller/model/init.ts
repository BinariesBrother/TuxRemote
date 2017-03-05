export function getJson(){
  return {
    "views": [
      {
        "name":"Navigator",
        "commandesTypes":[
            {
              "name":"Navigator.next",
              "command":{
                  "name":"Next Tab",
                  "shell":"xdotool key ctrl+Tab"
              }
            },
            {
              "name":"Navigator.previous",
              "command":{
                  "name":"Previous Tab",
                  "shell":"xdotool key ctrl+shift+Tab"
              }
            },
            {
              "name":"Navigator.set_url"
            }
        ]
      },
      {
        "name":"Default",
        "commandesTypes":[]
      },
      {
        "name":"Player",
        "commandesTypes":[
            {
              "name":"Player.next"
            },
            {
              "name":"Player.pause"
            },
            {
              "name":"Player.play"
            },
            {
              "name":"Player.previous"
            },
            {
              "name":"Player.stop"
            }
        ]
      }
    ],

    "applications": [
    {
        "id":"NAVIGATOR.FIREFOX",
        "name":"Firefox",
        "view":"NAVIGATOR",
        "commands":[]
    },
    {
        "id":"DESKTOP_WINDOW.NAUTILUS",
        "name":"Bureau",
        "view":"DEFAULT",
        "commands":[]
    },
    {
        "id":"VLC.VLC",
        "name":"Vlc",
        "view":"PLAYER",
        "commands":[]
    },
    {
        "id":"GNOME-TERMINAL.GNOME-TERMINAL",
        "name":"Terminal",
        "view":"Default",
        "commands":[]
    },
    {
        "id":"CHROMIUM-BROWSER.CHROMIUM-BROWSER",
        "name":"Chromium",
        "view":"NAVIGATOR",
        "commands":[]
    },
    {
        "id":"SMPLAYER.SMPLAYER",
        "name":"SMPlayer",
        "view":"Player",
        "commands":[]
    }
  ]};
}