import {Command} from "./entities/Command";
import {Application} from "./entities/Application";
import {CommandRepository}  from "./repository/CommandRepository"
import {ApplicationRepository}  from "./repository/ApplicationRepository"
import {CommandTypeRepository}  from "./repository/CommandTypeRepository"
import {ViewRepository}  from "./repository/ViewRepository"
import * as connectionManager from "./repository/Connection";


async function init() : Promise<Object> {
  let connectionMere = await connectionManager.session();
  let transaction = connectionMere.entityManager.transaction(async connection=>{
    let result = await CommandTypeRepository.init(connection, [
      { 'name': 'play' },
      { 'name': 'pause' },
      { 'name': 'stop' },
      { 'name': 'next' },
      { 'name': 'previous' },
      { 'name': 'set_url' }
    ]);
    console.log(result);

    result = await ViewRepository.init(connection, [
      { 'name': 'Default', commandTypes: [] },
      { 'name': 'Player', commandTypes: ['play', 'pause', 'stop', 'next', 'previous'] },
      { 'name': 'Navigator', commandTypes: ['next', 'previous', 'set_url'] }
    ]);
    
    console.log(result);

    result = await ApplicationRepository.init(connection, [
      {
        'id': 'Navigator.Firefox',
        'name': 'Firefox',
        'viewName': 'Navigator',
        'icon': undefined
      },
      {
        'id': 'Chromium-browser.Chromium-browser',
        'name': 'Chromium',
        'viewName': 'Navigator',
        'icon': undefined
      },
      {
        'id': 'gnome-terminal.Gnome-terminal',
        'name': 'Terminal',
        'viewName': 'Default',
        'icon': undefined
      },
      {
        'id': 'desktop_window.Nautilus',
        'name': 'Bureau',
        'viewName': 'Default',
        'icon': undefined
      },
      {
        'id': 'smplayer.Smplayer',
        'name': 'SMPlayer',
        'viewName': 'Player',
        'icon': undefined
      },
      {
        'id': 'vlc.Vlc',
        'name': 'Vlc',
        'viewName': 'Player',
        'icon': undefined
      }
    ]);

  console.log(result);


    result = CommandRepository.init(connection ,[
      {
        name: 'Next Tab',
        type: undefined,
        applicationId: 'Navigator.Firefox',
        shell: 'xdotool key ctrl+Tab',
        icon: undefined
      },
      {
        name: 'Previous Tab',
        type: undefined,
        applicationId: 'Navigator.Firefox',
        shell: 'xdotool key ctrl+shift+Tab',
        icon: undefined
      },
      {
        name: 'Play/Pause',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action play_or_pause',
        icon: undefined
      },
      {
        name: 'Previous',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action play_prev',
        icon: undefined
      },
      {
        name: 'Next',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action play_next',
        icon: undefined
      },
      {
        name: 'stop',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action stop',
        icon: undefined
      },
      {
        name: 'fullScreen',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action fullscreen',
        icon: undefined
      },
      {
        name: 'shuffle',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action pl_shuffle',
        icon: undefined
      },
      {
        name: 'repeat',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action repeat',
        icon: undefined
      },
      {
        name: 'acceleration',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action double_speed',
        icon: undefined
      },
      {
        name: 'deceleration',
        type: undefined,
        applicationId: 'smplayer.Smplayer',
        shell: 'smplayer -send-action halve_speed',
        icon: undefined
      }

    ]);
    return result;
  });
return transaction;
};

init();


/*

  
 */